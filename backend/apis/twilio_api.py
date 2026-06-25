from twilio.twiml.voice_response import VoiceResponse, Connect, Dial

from environment import RETELL_AGENT_ID, TWILIO_PHONE_NUMBER
from main import app
from fastapi import Request, Response

from retell_module import retell_client


@app.post("/voice")
async def twilio_webhook(req: Request, res: Response):
    body = req.values
    print(body)
    phone_call_response = retell_client.call.register_phone_call(
        agent_id=RETELL_AGENT_ID,
        from_number=body["From"],
        to_number=TWILIO_PHONE_NUMBER,
        direction="inbound"
    )
    response = VoiceResponse()
    dial = Dial()
    dial.sip(f"sip:{phone_call_response.call_id}@sip.retellai.com")
    response.append(dial)
    connect = Connect()
    connect.stream(url=f"wss://{req.headers.get("host")}/media-stream")
    response.append(connect)
    # Uncomment for testing
    response.say("Hello! This is your AI voice agent. Let me connect you.")
    return response.to_xml()
