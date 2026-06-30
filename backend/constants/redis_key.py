def get_redis_emotional_analysis_key(call_id) -> str:
    return f'emotional_analysis:{call_id}'