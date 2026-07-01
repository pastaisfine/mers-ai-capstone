import json

from fastapi import Request
from sqlalchemy import select

from database import db_dependency
from environment import RETELL_AGENT_ID
from main import app
from models.schema import Call, CallTranscript
from modules.connection_modules import CONNECTED_SSE_CLIENTS
from retell_module import retell_client
from uuid_v7.base import uuid7


@app.post("/retell-webhook")
async def retell_webhook(request: Request, db: db_dependency):
    """
    Handles three Retell webhook events:
    - transcript        : fired mid-call after each utterance (real-time)
    - call_ended        : fired when call disconnects (full transcript)
    - call_analyzed     : fired after post-call analysis (may include richer data)

    For `transcript` events we upsert individual utterances so the frontend
    sees each line as it happens.  For `call_ended` / `call_analyzed` we do a
    full replace-all so the final authoritative transcript is always stored.
    """
    payload = await request.json()
    event = payload.get("event")
    call_data = payload.get("call", {})
    provider_sid = call_data.get("call_id")

    if not provider_sid:
        return {"status": "ok"}

    stmt = select(Call).where(Call.provider_sid == provider_sid)
    call = db.scalars(stmt).first()
    if not call:
        return {"status": "ok"}

    transcript_object = call_data.get("transcript_object", [])

    if event == "transcript":
        # Retell sends the *entire* growing transcript each time, so we sync
        # by deleting existing rows and reinserting — keeps seq numbers stable.
        existing = db.scalars(
            select(CallTranscript).where(CallTranscript.call_id == call.id)
        ).all()
        existing_seqs = {t.seq: t for t in existing}

        for seq, utterance in enumerate(transcript_object):
            role    = utterance.get("role", "user")
            content = utterance.get("content", "")
            words   = utterance.get("words", [])
            start_ms = int(words[0]["start"] * 1000) if words else 0
            end_ms   = int(words[-1]["end"] * 1000)  if words else 0

            if seq in existing_seqs:
                # Update existing row in place (content may grow mid-utterance)
                row = existing_seqs[seq]
                row.transcript    = content
                row.end_duration  = end_ms
                db.add(row)
            else:
                db.add(CallTranscript(
                    id=uuid7(),
                    call_id=call.id,
                    transcript=content,
                    role=role,
                    seq=seq,
                    start_duration=start_ms,
                    end_duration=end_ms,
                ))
        db.commit()

    elif event in ("call_ended", "call_analyzed"):
        # Full authoritative transcript — delete stale rows then reinsert
        db.query(CallTranscript).where(CallTranscript.call_id == call.id).delete()

        for seq, utterance in enumerate(transcript_object):
            role    = utterance.get("role", "user")
            content = utterance.get("content", "")
            words   = utterance.get("words", [])
            start_ms = int(words[0]["start"] * 1000) if words else 0
            end_ms   = int(words[-1]["end"] * 1000)  if words else 0

            db.add(CallTranscript(
                id=uuid7(),
                call_id=call.id,
                transcript=content,
                role=role,
                seq=seq,
                start_duration=start_ms,
                end_duration=end_ms,
            ))
        db.commit()

    return {"status": "ok"}


@app.get("/incidents/{incident_id}/transcripts")
async def get_incident_transcripts(incident_id: str, db: db_dependency):
    """Returns stored transcripts and the call_id for Supabase realtime subscription."""
    stmt = select(Call).where(Call.incident_id == incident_id)
    call = db.scalars(stmt).first()

    if not call:
        return {"call_id": None, "transcripts": []}

    transcript_stmt = (
        select(CallTranscript)
        .where(CallTranscript.call_id == call.id)
        .order_by(CallTranscript.seq)
    )
    transcripts = db.scalars(transcript_stmt).all()

    return {
        "call_id": str(call.id),
        "transcripts": [
            {
                "id": str(t.id),
                "seq": t.seq,
                "role": t.role,
                "transcript": t.transcript,
                "start_duration": t.start_duration,
                "end_duration": t.end_duration,
            }
            for t in transcripts
        ],
    }


@app.get("/retell/agent")
async def get_retell_agent():
    """Returns current Retell agent configuration."""
    agent = retell_client.agent.retrieve(RETELL_AGENT_ID)
    return {
        "agent_id": agent.agent_id,
        "agent_name": getattr(agent, "agent_name", "ARIA"),
        "voice_id": getattr(agent, "voice_id", ""),
        "language": getattr(agent, "language", "en-US"),
    }


@app.patch("/retell/agent")
async def update_retell_agent(body: dict):
    """Updates Retell agent voice/language settings."""
    update_fields = {
        k: body[k]
        for k in ("voice_id", "language", "agent_name")
        if k in body
    }
    agent = retell_client.agent.update(RETELL_AGENT_ID, **update_fields)
    return {
        "agent_id": agent.agent_id,
        "agent_name": getattr(agent, "agent_name", "ARIA"),
        "voice_id": getattr(agent, "voice_id", ""),
        "language": getattr(agent, "language", "en-US"),
    }
