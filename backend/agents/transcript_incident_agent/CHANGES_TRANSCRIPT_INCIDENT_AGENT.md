# Transcript-to-Incident Extraction Agent

## Overview

A LangChain agent that listens for ended calls, fetches the full transcript, and extracts structured incident data using Gemini. The extracted fields update the draft `Incident` record that was created when the call started.

## Data Flow

```
Call ends via Retell WebSocket
  │
  ├─ websocket.py finally block
  │   ├─ sets Call.ended_at = now()
  │   └─ pushes call_id to Redis queue "incident_extract_queue"
  │
  ▼
incident_extract_consumer.py (background thread)
  │
  ├─ brpop from Redis queue
  └─ calls run_incident_extraction(call_id, db)
       │
       ├─ checks Incident.title != "DRAFT INCIDENT" (skip if already processed)
       ├─ fetches all utterances via read_transcripts(call_id)
       ├─ formats into timestamped dialogue string
       ├─ runs LangChain chain: Gemini extracts structured data
       └─ updates the draft Incident record via update_data_by_id
```

## Files Created

### `backend/agents/transcript_incident_agent/__init__.py`
Empty init file to make the folder a Python package.

### `backend/agents/transcript_incident_agent/models.py`
Pydantic model `ExtractedIncident` that mirrors the LLM-output fields. This is separate from the SQLAlchemy `Incident` ORM model. Fields match the `Incident` table columns exactly.

### `backend/agents/transcript_incident_agent/chain.py`
LangChain wiring:
- System prompt instructing Gemini on emergency dispatch analysis
- Human prompt with `{transcript}` variable and `{format_instructions}` (partially applied from the parser)
- `PydanticOutputParser` wrapping `ExtractedIncident`
- LLM: `ChatGoogleGenerativeAI` using `gemini-2.5-flash` (update model name if needed)
- Exported `chain`, `parser`, `prompt`, and `format_utterances()`

### `backend/agents/transcript_incident_agent/agent.py`
Orchestrator function `run_incident_extraction(call_id, db)`:
1. Loads `Call` and `Incident` records
2. Returns early if title is not `"DRAFT INCIDENT"` (already processed)
3. Fetches utterances via `call_transcript_module.read_transcripts()`
4. Formats them with `format_utterances()` into a timestamped dialogue
5. Invokes the LangChain chain
6. Writes extracted fields to the Incident via `db_module.update_data_by_id()`
7. On failure: writes `status: {"stage": "draft", "extraction_error": "..."}` to the Incident

### `backend/agents/incident_extract_consumer.py`
Background Redis consumer thread:
- Infinite loop gated by `base.keep_running` (set by lifespan)
- `brpop` from `INCIDENT_EXTRACT_QUEUE_KEY` with 1-second timeout
- Calls `run_incident_extraction()` on each popped call_id
- Errors are caught, logged, and the loop continues

## Files Modified

### `backend/models/schema.py` (line 70)
Added `ended_at` column to `Call` model:
```python
ended_at = Column(DateTime, nullable=True)
```

### `backend/constants/redis_key.py`
Added:
```python
INCIDENT_EXTRACT_QUEUE_KEY = "incident_extract_queue"
```

### `backend/modules/redis_module.py`
Added two methods to `RedisClient`:
- `brpop(key, timeout=0)` — blocking right-pop from a list
- `lpush(key, value)` — left-push to a list

### `backend/apis/websocket.py` (lines 158–166)
In `llm_websocket_for_retell`'s `finally` block:
```python
if internal_call_id is not None:
    call = db.get(Call, internal_call_id)
    if call and call.ended_at is None:
        call.ended_at = datetime.now()
        db.commit()
        redis_client.lpush(INCIDENT_EXTRACT_QUEUE_KEY, str(internal_call_id))
```
- Sets `Call.ended_at` to mark call completion
- Pushes `call_id` onto the Redis queue to trigger extraction

### `backend/async_context_managers/lifespan.py`
Added the extract consumer as a background task alongside the existing consumers:
```python
incident_extract_task = asyncio.create_task(asyncio.to_thread(incident_extract_consumer))
```
Also added shutdown cleanup in the `gather` call.

### `backend/requirements.txt`
Added:
```
langchain-google-genai
pytest
```

### Alembic migration: `f7c2a1b3d4e5_add_ended_at_to_calls.py`
Adds the `ended_at` column to the `calls` table.

## Tests

### `backend/tests/test_chain.py`
6 unit tests:
- `test_prompt_renders_format_instructions` — verifies the prompt template has the expected variables
- `test_parser_schema` — verifies all expected fields exist on `ExtractedIncident`
- `test_parser_parses_valid_json` — parser correctly deserializes valid JSON
- `test_parser_rejects_invalid_type` — parser rejects invalid IncidentType enum values
- `test_parser_requires_title` — parser requires the `title` field
- `test_parser_handles_all_fields` — parser handles all fields including nested JSON

### `backend/tests/test_extraction.py`
2 tests:
- `test_format_utterances` — verifies the utterance-to-dialogue formatting
- `test_gemini_extraction` — smoke test that runs the actual Gemini chain against `call_transcripts/call_1.txt` (requires `GEMINI_API_KEY` in `.env`)

## How to Deploy

1. **Apply the migration:**
   ```bash
   cd backend
   alembic upgrade head
   ```

2. **Install dependencies:**
   ```bash
   pip install langchain-google-genai pytest
   ```

3. **Run tests:**
   ```bash
   pytest tests/test_chain.py -v
   ```

4. **Start the backend:**
   The consumer is automatically started in the FastAPI lifespan. No additional setup needed.

## Environment Variables

No new env vars required. Uses existing `GEMINI_API_KEY` from `backend/.env` and the existing Redis connection.
