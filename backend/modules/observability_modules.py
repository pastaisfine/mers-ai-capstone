import json
import logging
from typing import Any

logger = logging.getLogger("mers_ai_rag")

def log_event(event: str, **fields: Any) -> None:
    """Emit one machine-readable event without including raw transcript data."""
    payload = {"event": event, **fields}
    logger.info(json.dumps(payload, default=str, separators=(",", ":")))