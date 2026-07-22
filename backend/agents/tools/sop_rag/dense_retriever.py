import math
import os
from functools import lru_cache
from time import perf_counter
from typing import Any

import psycopg
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pgvector import Vector
from pgvector.psycopg import register_vector
from psycopg import sql
from psycopg_pool import ConnectionPool

from modules.observability_modules import log_event
from agents.tools.sop_rag.skill_cards import (
    EMBEDDING_MODEL,
    QUERY_TASK_TYPE,
    VECTOR_SCHEMA,
    VECTOR_TABLE,
    embedding_source_sha256,
    load_incident_skill_cards,
)


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")


def _qualified_table() -> sql.Composed:
    return sql.SQL("{}.{}").format(
        sql.Identifier(VECTOR_SCHEMA),
        sql.Identifier(VECTOR_TABLE),
    )


def _database_url() -> str:
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is required for pgvector retrieval")
    return DATABASE_URL


def _configure_connection(connection: psycopg.Connection) -> None:
    register_vector(connection)
    connection.commit()


@lru_cache(maxsize=1)
def get_connection_pool() -> ConnectionPool:
    return ConnectionPool(
        conninfo=_database_url(),
        min_size=0,
        max_size=5,
        timeout=10,
        kwargs={"prepare_threshold": None},
        configure=_configure_connection,
    )


def close_connection_pool() -> None:
    if get_connection_pool.cache_info().currsize:
        get_connection_pool().close()
        get_connection_pool.cache_clear()


def _normalized(vector: list[float]) -> list[float]:
    if not vector or not all(math.isfinite(value) for value in vector):
        raise ValueError("Gemini returned an invalid query embedding")
    norm = math.sqrt(math.fsum(value * value for value in vector))
    if norm <= 0:
        raise ValueError("Gemini returned a zero-norm query embedding")
    return [value / norm for value in vector]


@lru_cache(maxsize=1)
def get_embeddings() -> GoogleGenerativeAIEmbeddings:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is required for semantic retrieval")
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        api_key=GEMINI_API_KEY,
        task_type=QUERY_TASK_TYPE,
    )


@lru_cache(maxsize=256)
def embed_query_cached(query: str) -> list[float]:
    return _normalized(
        get_embeddings().embed_query(query, task_type=QUERY_TASK_TYPE)
    )


@lru_cache(maxsize=1)
def validate_vector_store() -> dict[str, Any]:
    cards = load_incident_skill_cards()
    expected_ids = {card["sop_id"] for card in cards}
    expected_source = embedding_source_sha256()
    with get_connection_pool().connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL(
                    """
                    SELECT
                        sop_id,
                        embedding_model,
                        embedding_dimensions,
                        source_sha256
                    FROM {}
                    """
                ).format(_qualified_table())
            )
            rows = cursor.fetchall()

    stored_ids = {row[0] for row in rows}
    if stored_ids != expected_ids:
        missing = sorted(expected_ids - stored_ids)
        unexpected = sorted(stored_ids - expected_ids)
        raise ValueError(
            f"Pgvector SOP IDs are out of sync; missing={missing}, unexpected={unexpected}"
        )
    models = {row[1] for row in rows}
    dimensions = {row[2] for row in rows}
    source_hashes = {row[3] for row in rows}
    if models != {EMBEDDING_MODEL}:
        raise ValueError("Pgvector embedding model is out of sync")
    if len(dimensions) != 1 or next(iter(dimensions), 0) <= 0:
        raise ValueError("Pgvector embedding dimensions are inconsistent")
    if source_hashes != {expected_source}:
        raise ValueError("Pgvector embeddings are stale; rerun ingestion")
    return {
        "count": len(rows),
        "model": EMBEDDING_MODEL,
        "dimensions": next(iter(dimensions)),
        "source_sha256": expected_source,
    }


def _pgvector_search(embedding: list[float], k: int) -> list[tuple[str, float]]:
    with get_connection_pool().connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                sql.SQL(
                    """
                    SELECT sop_id, embedding <=> %s AS distance
                    FROM {}
                    WHERE embedding_model = %s AND source_sha256 = %s
                    ORDER BY distance, sop_id
                    LIMIT %s
                    """
                ).format(_qualified_table()),
                (
                    Vector(embedding),
                    EMBEDDING_MODEL,
                    embedding_source_sha256(),
                    k,
                ),
            )
            return [(row[0], float(row[1])) for row in cursor.fetchall()]


def dense_retrieve(
    query: str, k: int = 5, request_id: str | None = None
) -> list[dict[str, Any]]:
    timer = perf_counter()
    embedding_timer = perf_counter()
    embedding = embed_query_cached(query)
    embedding_ms = round((perf_counter() - embedding_timer) * 1000, 2)
    search_timer = perf_counter()
    results = _pgvector_search(embedding, k)
    vector_search_ms = round((perf_counter() - search_timer) * 1000, 2)
    cards = {card["sop_id"]: card for card in load_incident_skill_cards()}

    dense_results = []
    for rank, (sop_id, distance) in enumerate(results, start=1):
        card = cards[sop_id]
        dense_results.append(
            {
                "rank": rank,
                "distance_score": distance,
                "sop_id": sop_id,
                "skill_name": card["skill_name"],
                "emergency_type": card["emergency_type"],
                "priority_level": card["priority_level"],
                "full_sop_ref": card["full_sop_ref"],
                "summary": card["summary"],
                "high_signal_phrases": card["high_signal_phrases"],
                "supporting_phrases": card["supporting_phrases"],
                "required_any": card["required_any"],
                "ambiguity_phrases": card["ambiguity_phrases"],
            }
        )

    log_event(
        "dense_retrieval",
        request_id=request_id,
        duration_ms=round((perf_counter() - timer) * 1000, 2),
        embedding_ms=embedding_ms,
        vector_search_ms=vector_search_ms,
        result_count=len(dense_results),
        top_sop_id=dense_results[0]["sop_id"] if dense_results else None,
        top_distance=dense_results[0]["distance_score"] if dense_results else None,
        second_distance=(
            dense_results[1]["distance_score"] if len(dense_results) > 1 else None
        ),
    )
    return dense_results
