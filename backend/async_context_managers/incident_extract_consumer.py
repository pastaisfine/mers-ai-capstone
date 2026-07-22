import logging
import time

from constants.redis_key import INCIDENT_EXTRACT_QUEUE_KEY
from async_context_managers import base
from agents.transcript_incident_agent.agent import run_incident_extraction
from modules.redis_module import redis_client

logger = logging.getLogger(__name__)


def incident_extract_consumer():
    while base.keep_running:
        try:
            result = redis_client.client.brpop(INCIDENT_EXTRACT_QUEUE_KEY, timeout=1)
            if result is None:
                continue

            _, call_id_str = result
            call_id = call_id_str  # already a string from redis decode_responses=True

            logger.info("Processing incident extraction for call %s", call_id)
            run_incident_extraction(call_id, base.db)
        except Exception as e:
            logger.error("Incident extract consumer error: %s", e)
            time.sleep(0.5)