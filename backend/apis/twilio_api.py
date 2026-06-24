from twilio.twiml.voice_response import VoiceResponse, Connect

from main import app
from fastapi import Request, Response


@app.post("/voice")
async def twilio_webhook(req: Request, res: Response):
    response = VoiceResponse()
    connect = Connect()
    connect.stream(url=f"wss://{req.headers.get("host")}/media-stream")
    response.append(connect)
    # Uncomment for testing
    response.say("Hello! This is your AI voice agent. Let me connect you.")
    return response.to_xml()
