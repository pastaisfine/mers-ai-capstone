import base64
import io

from fastapi import WebSocketDisconnect
from main import app
from fastapi import WebSocket

from modules import storage_module


@app.websocket("/media-stream")
async def media_stream(websocket: WebSocket):
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
                    print(f"🎙️ Call started - StreamSid: {stream_sid}")
                case "media":
                    # raw audio encoded in base64
                    stream_sid = websocket.session.get("sid")
                    raw_voice = msg["media"]["payload"]
                    audio_bytes = base64.b64decode(raw_voice)
                    file_name = f'raw_audio_{stream_sid}.wav'

                    #1 try to get file from supabase bucket
                    download_response = storage_module.download_file(file_name)
                    bytes_buffer = io.BytesIO()
                    if download_response is not None:
                        bytes_buffer.write(download_response)
                    bytes_buffer.write(audio_bytes)

                    #4 store file into supabase bucket
                    upload_response = storage_module.upload_file(file_name, bytes_buffer.getvalue())

                    #5 add emotional analysis task to pending queue based on one voice file with 5 seconds at one


                    #6 add messaging queue

                case "stop":
                    print("⏹️ Call ended ")
                case _:
                    print(f"Unknown event: {msg['event']}")
    except WebSocketDisconnect:
        print("Websocket connection disconnected")
