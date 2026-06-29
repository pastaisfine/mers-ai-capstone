import base64
import io

from fastapi import WebSocketDisconnect

from constants.file import to_voice_file_name
from main import app, db_dependency
from fastapi import WebSocket

from modules import storage_module, call_module


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
                    audio_bytes = base64.b64decode(raw_voice)
                    file_name = to_voice_file_name(str(call_id))

                    download_response = storage_module.download_file(file_name)
                    bytes_buffer = io.BytesIO()
                    if download_response is not None:
                        bytes_buffer.write(download_response)
                    bytes_buffer.write(audio_bytes)
                    storage_module.upload_file(file_name, bytes_buffer.getvalue())
                    app.pika_emotion_analyse_publisher.publish({
                        "call_id": str(call_id),
                        "is_done": False,
                    })

                case "stop":
                    print("⏹️ Call ended ")
                    call_id = websocket.session.get("call_id")
                    app.pika_emotion_analyse_publisher.publish({
                        "call_id": str(call_id),
                        "is_done": True,
                    })
                case _:
                    print(f"Unknown event: {msg['event']}")
    except WebSocketDisconnect:
        print("Websocket connection disconnected")
