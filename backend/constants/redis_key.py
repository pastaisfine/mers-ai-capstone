def get_redis_emotional_analysis_key(call_id) -> str:
    return f'emotional_analysis:{call_id}'

PENDING_CALL_TRANSCRIPT_MAP_KEY = "pending_call_transcript_map"
TRANSCRIPT_CONSUME_QUEUE_KEY = "transcript_consume_queue"

def get_transcript_utterance_set_key(call_id):
    return f"transcript_utterance_set:{call_id}"