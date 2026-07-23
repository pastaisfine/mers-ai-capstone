import asyncio
import json
import time
from typing import List

from constants.redis_key import TRANSCRIPT_CONSUME_QUEUE_KEY, PENDING_CALL_TRANSCRIPT_MAP_KEY, \
    get_transcript_utterance_set_key
from models.database.call_transcript import CreateCallTranscriptPayload, UtteranceExistsPayload
from models.dto.retell import Utterance
from modules.redis_module import redis_client
from modules.transcripts import call_transcript_module
from async_context_managers import base


async def transcript_process_consumer():
    while base.keep_running:
        try:
            result = redis_client.zpopmin(TRANSCRIPT_CONSUME_QUEUE_KEY)
            if not result:
                await asyncio.sleep(0.1)
                continue
            process_call_id = result[0][0]
            print("transcript_process_consumer: Processing call transcript for call", process_call_id)

            transcript_json = redis_client.hpop(PENDING_CALL_TRANSCRIPT_MAP_KEY, process_call_id)
            print("transcript_process_consumer: Processing call transcript for call", process_call_id, "with transcript", transcript_json)
            if transcript_json is None:
                continue
            transcript = [Utterance(**u) for u in json.loads(transcript_json)]

            for utterance in transcript:
                default_start_duration: int = 0
                default_end_duration: int = 0
                if utterance.words and len(utterance.words) > 0:
                    if utterance.words[0].start is not None:
                        default_start_duration = int(utterance.words[0].start * 1000)
                    if utterance.words[-1].end is not None:
                        default_end_duration = int(utterance.words[-1].end * 1000)

                call_transcript_module.upsert_call_transcript(
                    call_id=process_call_id,
                    role=utterance.role,
                    content=utterance.content,
                    start_duration=default_start_duration,
                    end_duration=default_end_duration,
                    db=base.db,
                )

            base.db.commit()
        except Exception as e:
            print(f"transcript_process_consumer error: {e}")
            await asyncio.sleep(0.5)
