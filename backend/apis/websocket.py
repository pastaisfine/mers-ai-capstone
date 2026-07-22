import asyncio
import json

from fastapi import WebSocketDisconnect

from constants.redis_key import PENDING_CALL_TRANSCRIPT_MAP_KEY, TRANSCRIPT_CONSUME_QUEUE_KEY
from main import app
from database import db_dependency
from fastapi import WebSocket

from modules.redis_module import redis_client
from modules import location_agent_module  # <-- added

from models.dto.retell import ConfigResponse, inbound_event_adapter, RetellInboundEvent, \
    RetellInteractionType, ResponseRequiredRequest
from modules import call_module
from concurrent.futures import TimeoutError as ConnectionTimeoutError


@app.websocket("/media-stream")
async def media_stream(websocket: WebSocket, db: db_dependency):
    await websocket.accept()
    print("Websocket connected")
    try:
        while True:
            msg = await websocket.receive_json()
            # TODO: Validate msg before after logic

            match msg["event"]:
                case "connected":
                    print("📞 Twilio Stream connected")
                case "start":
                    stream_sid = msg["start"]["streamSid"]
                    websocket.session.update({"sid": stream_sid})
                    call_id = call_module.get_call_id_by_sid(stream_sid, db=db)
                    websocket.session.update({"call_id": call_id})
                    print(f"🎙️ Call started - StreamSid: {stream_sid}")
                case "media":
                    # raw audio encoded in base64
                    call_id = websocket.session.get("call_id")
                    if call_id is None:
                        print("Call id is not initialized")
                        return
                    raw_voice = msg["media"]["payload"]
                    # audio_bytes = base64.b64decode(raw_voice)
                    # file_name = to_voice_file_name(str(call_id))

                    # download_response = storage_module.download_file(file_name)
                    # bytes_buffer = io.BytesIO()
                    # if download_response is not None:
                    #     bytes_buffer.write(download_response)
                    # bytes_buffer.write(audio_bytes)
                    # storage_module.upload_file(file_name, bytes_buffer.getvalue())
                    # app.pika_emotion_analyse_publisher.publish({
                    #     "call_id": str(call_id),
                    #     "is_done": False,
                    # })

                case "stop":
                    print("⏹️ Call ended ")
                    call_id = websocket.session.get("call_id")
                    # app.pika_emotion_analyse_publisher.publish({
                    #     "call_id": str(call_id),
                    #     "is_done": True,
                    # })
                case _:
                    print(f"Unknown event: {msg['event']}")
    except WebSocketDisconnect:
        print("Websocket connection disconnected")

pipeline = None

@app.websocket("/llm-socket/{call_id}")
async def llm_websocket_for_retell(websocket: WebSocket, db: db_dependency, call_id: str):

    try:
        await websocket.accept()
        # ref code
        # llm_client = LlmClient()
        config = ConfigResponse(
            response_type="config",
            config={
                "auto_reconnect": True,
                "call_details": False,
            },
            response_id=1
        )
        await websocket.send_json(config.__dict__)
        response_id = 0
        internal_call_id = call_module.get_call_id_by_sid(call_id, db=db)

        #connect to llm
        if internal_call_id is None:
            print("Call id is not initialized")
            await websocket.close(1011, "Server error")
            return
        # Send first message to signal ready of server
        response_id = 0
        # first_event = llm_client.draft_begin_message()
        # await websocket.send_json(first_event.__dict__)
        async def handle_message(event: RetellInboundEvent):
            nonlocal response_id

            match event.interaction_type:
                case RetellInteractionType.PING_PONG:
                    await websocket.send_json(
                        {
                            "response_type": "ping_pong",
                            "timestamp": event.timestamp,
                        }
                    )
                case "update_only":
                    transcript = event.transcript
                    # if redis_client.hexists(PENDING_CALL_TRANSCRIPT_MAP_KEY, internal_call_id):
                    #     # TODO: Redis Lock mechanism
                    redis_client.hset(PENDING_CALL_TRANSCRIPT_MAP_KEY, internal_call_id, transcript)
                    redis_client.zadd(TRANSCRIPT_CONSUME_QUEUE_KEY, internal_call_id)

                    # --- Location agent: extract straight from Retell's live
                    # transcript, no DB read needed to get the text itself ---
                    transcript_text = location_agent_module.flatten_utterances(transcript)
                    if location_agent_module.should_check_location(str(internal_call_id), transcript_text):
                        asyncio.create_task(
                            location_agent_module.extract_and_update_incident_location_from_text(
                                internal_call_id, transcript_text, db
                            )
                        )
                case "response_required" | "reminder_required":
                    response_id = event.response_id
                    request = ResponseRequiredRequest(
                        interaction_type=event.interaction_type,
                        response_id=response_id,
                        transcript=event.transcript,
                    )
                    print(
                        f"""Received interaction_type={event.interaction_type}, response_id={response_id}, last_transcript={event.transcript[-1].content}"""
                    )
        async for data in websocket.iter_text():
            event = inbound_event_adapter.validate_json(data)
            asyncio.create_task(handle_message(event))
    except WebSocketDisconnect:
        print(f"LLM WebSocket disconnected for {call_id}")
    except ConnectionTimeoutError as e:
        print(f"Connection timeout error for {call_id}")
    except Exception as e:
        print(f"Error in LLM WebSocket: {e} for {call_id}")
        await websocket.close(1011, "Server error")
    finally:
        print(f"LLM WebSocket connection closed for {call_id}")

