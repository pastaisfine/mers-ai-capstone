from datetime import datetime

from twilio.twiml.voice_response import VoiceResponse, Connect, Dial

from environment import RETELL_AGENT_ID, TWILIO_PHONE_NUMBER
from main import app
from database import db_dependency
from fastapi import Request, Form, Response

from models.database.call import InitCallPayload
from models.database.incident import InitIncidentPayload
from modules import call_module, db_module, incident_module
from retell_module import retell_client


@app.post("/voice")
async def twilio_webhook(req: Request, db: db_dependency, From: str = Form(...), CallSid: str = Form(...)):
    caller_number = From
    print(caller_number)
    phone_call_response = retell_client.call.register_phone_call(
        agent_id=RETELL_AGENT_ID,
        from_number=caller_number,
        to_number=TWILIO_PHONE_NUMBER,
        direction="inbound"
    )
    response = VoiceResponse()
    dial = Dial()
    dial.sip(f"sip:{phone_call_response.call_id}@sip.retellai.com")
    response.append(dial)
    connect = Connect()
    connect.stream(url=f"wss://{req.headers.get('host')}/media-stream")
    response.append(connect)
    # create incident
    print("creating incident now...")

    def _execute_single_transaction():
        init_incident_payload = InitIncidentPayload(title="DRAFT INCIDENT")
        new_incident = incident_module.init_incident(init_incident_payload, db)
        # Store Retell's call_id as provider_sid so the Retell webhook can look it up later
        init_call_payload = InitCallPayload(received_at=datetime.now(), caller_number=caller_number, provider_sid=phone_call_response.call_id, incident_id=new_incident.id)
        call_module.init_call(init_call_payload, db)


    db_module.execute_table_operation(db, db_execute_operation=_execute_single_transaction)
    # Uncomment for testing
    # response.say("Hello! This is your AI voice agent. Let me connect you.")

    return Response(content=str(response), media_type="text/xml")
