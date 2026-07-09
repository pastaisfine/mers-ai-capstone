import asyncio
import base64
import io

from fastapi import WebSocketDisconnect

from constants.file import to_voice_file_name
from main import app
from database import db_dependency
from fastapi import WebSocket

from models.database.call_transcript import CreateCallTranscriptPayload
from models.dto.retell import ConfigResponse
from modules import storage_module, call_module, call_transcript_module
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


@app.websocket("/llm-socket/{call_id}")
async def llm_websocket_for_retell(websocket: WebSocket, db: db_dependency, call_id: str):

    try:
        await websocket.accept()
        config = ConfigResponse(
            response_type="config",
            config={
                "auto_reconnect": True,
                "call_details": True,
            },
            response_id=1
        )
        await websocket.send_json(config.__dict__)
        response_id = 0
        internal_call_id = call_module.get_call_id_by_sid(call_id, db=db)
        if internal_call_id is None:
            print("Call id is not initialized")
            await websocket.close(1011, "Server error")
            return
        async def handle_message(request_json):
            nonlocal response_id

            match request_json["interaction_type"]:
                case "ping_pong":
                    await websocket.send_json(
                        {
                            "response_type": "ping_pong",
                            "timestamp": request_json["timestamp"],
                        }
                    )
                case "call_details":
                    print("TODO")
                case "update_only":
                    transcripts = request_json["transcript"]
                    for transcript in transcripts:
                        default_end_duration = 0
                        default_start_duration = transcript["words"][0]["start"] if transcript["words"][0]["start"] is not None else default_end_duration
                        default_end_duration = transcript["words"][-1]["end"] if transcript["words"][-1]["end"] is not None else default_start_duration
                        call_transcript_module.create_call_transcript(CreateCallTranscriptPayload(
                            call_id=internal_call_id,
                            role=transcript["role"],
                            transcript=transcript["content"],
                            start_duration=default_start_duration,
                            end_duration=default_end_duration
                        ), db)
                        break
                    # role
                    # content
                    # words
                    #   word
                    #   start
                    #   end
                case "response_required" | "reminder_required":
                    response_id = request_json["response_id"]
                    # request = ResponseRequiredRequest(
                    #     interaction_type=request_json["interaction_type"],
                    #     response_id=response_id,
                    #     transcript=request_json["transcript"],
                    # )
                    print(
                        f"""Received interaction_type={request_json['interaction_type']}, response_id={response_id}, last_transcript={request_json['transcript'][-1]['content']}"""
                    )
                    # async for event in llm_client.draft_response(request):
                    #     await websocket.send_json(event.__dict__)
                    #     if request.response_id < response_id:
                    #         break  # new response needed, abandon this one

        async for data in websocket.iter_json():
            asyncio.create_task(handle_message(data))
    except WebSocketDisconnect:
        print(f"LLM WebSocket disconnected for {call_id}")
    except ConnectionTimeoutError as e:
        print("Connection timeout error for {call_id}")
    except Exception as e:
        print(f"Error in LLM WebSocket: {e} for {call_id}")
        await websocket.close(1011, "Server error")
    finally:
        print(f"LLM WebSocket connection closed for {call_id}")

