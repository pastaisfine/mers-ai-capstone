from fastapi import WebSocketDisconnect
from main import app
from fastapi import WebSocket

@app.websocket("/media-stream")
async def media_stream(websocket: WebSocket):
    await websocket.accept()
    print("Websocket connected")
    try:
        while True:
            msg = await websocket.receive_json()
            # Validate msg before after logic

            match msg["event"]:
                case "connected":
                    print("📞 Twilio Stream connected")
                case "start":
                    stream_sid = msg["start"]["streamSid"]
                    print(f"🎙️ Call started - StreamSid: {stream_sid}")
                case "media":
                    print(f"Logic not implemented")
                case "stop":
                    print("⏹️ Call ended ")
                case _:
                    print(f"Unknown event: {msg['event']}")
            await websocket.send_text(f"Message text was: {msg["type"]}")
    except WebSocketDisconnect:
        print("Websocket connection disconnected")
