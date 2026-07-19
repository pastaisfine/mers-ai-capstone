from retell import Retell

from environment import RETELL_API_KEY, RETELL_AGENT_ID

retell_client = Retell(
    api_key=RETELL_API_KEY
)

def register_phone_call(caller_number: str, to_call: str):
    phone_call_response = retell_client.call.register_phone_call(
        agent_id=RETELL_AGENT_ID,
        from_number=caller_number,
        to_number=to_call,
        direction="inbound"
    )
    return phone_call_response