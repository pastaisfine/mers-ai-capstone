from typing import Any

from uuid_v7.base import UUID

transcript_job_queue: list[UUID] = []

def add_job(job_id: UUID) -> None:
    transcript_job_queue.append(job_id)

def pop_job() -> UUID | None:
    try:
        return transcript_job_queue.pop()
    except IndexError:
        return None