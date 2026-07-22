import asyncio
import logging
import time
from typing import Set
from uuid import UUID

from constants.redis_key import ACTIVE_CALLS_SET_KEY
from async_context_managers import base
from agents.transcript_incident_agent.live_chain import live_chain
from agents.transcript_incident_agent.chain import format_utterances
from modules.incidents.incident_update_broadcaster import incident_update_broadcaster
from modules.redis_module import redis_client
from modules.transcripts import call_transcript_module
from models.schema import Call

logger = logging.getLogger(__name__)

LIVE_EXTRACT_INTERVAL = 10
DEBOUNCE_SECONDS = 3


def _get_active_call_ids() -> Set[str]:
    members = redis_client.smembers(ACTIVE_CALLS_SET_KEY)
    return set(members) if members else set()


async def live_incident_extract_consumer():
    last_extracted: dict[str, float] = {}

    while base.keep_running:
        try:
            active_ids = _get_active_call_ids()
            now = time.time()

            for call_id_str in active_ids:
                last_time = last_extracted.get(call_id_str, 0)
                if now - last_time < LIVE_EXTRACT_INTERVAL:
                    continue

                call_id = UUID(call_id_str)
                utterances = call_transcript_module.read_transcripts(call_id, base.db)
                if not utterances:
                    continue

                # check debounce: wait for DEBOUNCE_SECONDS of silence
                last_utterance_time = max(u.created_at.timestamp() if u.created_at else 0 for u in utterances)
                if now - last_utterance_time < DEBOUNCE_SECONDS:
                    continue

                transcript_str = format_utterances(utterances)

                try:
                    extracted = live_chain.invoke({"transcript": transcript_str})
                    call = base.db.get(Call, call_id)
                    incident_id = str(call.incident_id) if call else ""

                    payload = {
                        "call_id": call_id_str,
                        "incident_id": incident_id,
                        "title": extracted.title,
                        "location": extracted.location,
                        "type": extracted.type,
                        "priority": 1,
                        "severity": "URGENT",
                    }

                    loop = base.main_loop
                    if loop is not None and loop.is_running():
                        asyncio.run_coroutine_threadsafe(
                            incident_update_broadcaster.broadcast(payload), loop
                        )

                    last_extracted[call_id_str] = now
                    logger.info("Live extracted: %s — %s", call_id_str, extracted.title)

                except Exception as e:
                    logger.warning("Live extraction failed for %s: %s", call_id_str, e)

        except Exception as e:
            logger.error("Live extract consumer error: %s", e)

        await asyncio.sleep(1)
