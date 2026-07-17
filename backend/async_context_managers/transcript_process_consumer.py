from typing import List

from constants.redis_key import TRANSCRIPT_CONSUME_QUEUE_KEY, PENDING_CALL_TRANSCRIPT_MAP_KEY, \
    get_transcript_utterance_set_key
from models.database.call_transcript import CreateCallTranscriptPayload, UtteranceExistsPayload
from modules.redis_module import redis_client
from modules.transcripts import call_transcript_module
from async_context_managers import base


def transcript_process_consumer():
    while base.keep_running:
        process_call_id = redis_client.zpopmin(TRANSCRIPT_CONSUME_QUEUE_KEY)
        if process_call_id is not None:
            transcript = redis_client.hpop(PENDING_CALL_TRANSCRIPT_MAP_KEY, process_call_id)
            unsend_utterances: List[CreateCallTranscriptPayload] = []
            for utterance in reversed(transcript):
                default_end_duration:int = 0
                default_start_duration: int = int(utterance.words[0].start * 1000) if utterance.words[0].start  is not None else default_end_duration
                default_end_duration: int = int(utterance.words[-1].end * 1000) if utterance.words[-1].end is not None else default_start_duration
                utterance_unique_id = f"{process_call_id}_{utterance.words[0].start}_{utterance.words[-1].end}"
                redis_key = get_transcript_utterance_set_key(process_call_id)
                has_in_redis = redis_client.sismember(redis_key, utterance_unique_id)
                if has_in_redis:
                    break
                else:
                    has_utterance =  call_transcript_module.utterance_exists(UtteranceExistsPayload(
                        call_id= process_call_id,
                        start_duration= default_start_duration,
                        end_duration= default_end_duration,
                    ), base.db)
                    if has_utterance:
                        break
                    else:
                        unsend_utterances.insert(0, CreateCallTranscriptPayload(
                            call_id=process_call_id,
                            role=utterance.role,
                            transcript=utterance.content,
                            start_duration=default_start_duration,
                            end_duration=default_end_duration
                        ))
                        redis_client.zadd(redis_key, utterance_unique_id)
            for u in unsend_utterances:
                call_transcript_module.create_call_transcript(u, base.db)
                base.db.commit()