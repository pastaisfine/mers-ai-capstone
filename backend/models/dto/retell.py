# These pydantic models is based on https://docs.retellai.com/api-references/llm-websocket
# Retell -> Your Server Event Spec section those four event

from enum import StrEnum
from typing import List, Optional, Literal, Union, Annotated, Dict
from pydantic import BaseModel, Field, TypeAdapter


# --- Provided Enum ---
class RetellInteractionType(StrEnum):
    PING_PONG = "ping_pong"
    UPDATE_ONLY = "update_only"
    RESPONSE_REQUIRED = "response_required"
    REMINDER_REQUIRED = "reminder_required"

class RetellResponseType(StrEnum):
    RESPONSE = "response"

class RetellTurningType(StrEnum):
    AGENT_TURN = "agent_turn"
    USER_TURN = "user_turn"

class RetellRoleType(StrEnum):
    AGENT = "agent"
    USER = "user"

# --- Supporting Models ---
class WordTimings(BaseModel):
    word: str
    start: float
    end: float


class Utterance(BaseModel):
    role: RetellRoleType
    content: str
    words: Optional[List[WordTimings]] = None

# --- Base Event Model ---
class RetellBaseEvent(BaseModel):
    interaction_type: RetellInteractionType


# --- 5 Specific Event Models ---

class PingPongEvent(RetellBaseEvent):
    """
    Ping Pong Event
    Sent periodically to check for disconnection and keep the connection alive.
    """
    interaction_type: Literal[RetellInteractionType.PING_PONG] = RetellInteractionType.PING_PONG
    timestamp: int  # Milliseconds since epoch

class UpdateOnlyEvent(RetellBaseEvent):
    """
    Update Only Event
    Sent real-time updates about the call such as live transcripts and turntaking changes.
    """
    interaction_type: Literal[RetellInteractionType.UPDATE_ONLY] = RetellInteractionType.UPDATE_ONLY
    transcript: List[Utterance]
    transcript_with_tool_calls: Optional[List[dict]] = None  # Populated when enabled in config
    turntaking: Optional[RetellTurningType] = None


class ResponseRequiredEvent(RetellBaseEvent):
    """
    Response Required Event
    Requires a response from your server for the current live transcript.
    """
    interaction_type: Literal[RetellInteractionType.RESPONSE_REQUIRED] = RetellInteractionType.RESPONSE_REQUIRED
    response_id: int  # Unique auto-incrementing id to track the response needed
    transcript: List[Utterance]
    transcript_with_tool_calls: Optional[List[dict]] = None


class ReminderRequiredEvent(RetellBaseEvent):
    """
    Reminder Required Event
    Sent when the user has not spoken for a while and a reminder is needed.
    """
    interaction_type: Literal[RetellInteractionType.REMINDER_REQUIRED] = RetellInteractionType.REMINDER_REQUIRED
    response_id: int  # Unique auto-incrementing id to track the response needed
    transcript: List[Utterance]
    transcript_with_tool_calls: Optional[List[dict]] = None


# --- Discriminated Union Type ---
RetellInboundEvent = Annotated[
        Union[PingPongEvent, UpdateOnlyEvent, ResponseRequiredEvent, ReminderRequiredEvent],
    Field(discriminator="interaction_type")
]

inbound_event_adapter = TypeAdapter(RetellInboundEvent)

class ConfigResponse(BaseModel):
    response_type: Literal["config"] = "config"
    config: Dict[str, bool] = {
        "auto_reconnect": bool,
        "call_details": bool,
    }
    response_id: int

class ResponseRequiredRequest(BaseModel):
    interaction_type: Literal["reminder_required", "response_required"]
    response_id: int
    transcript: List[Utterance]

# https://docs.retellai.com/api-references/llm-websocket#response-event
class ResponseResponseEvent(BaseModel):
    response_type: Literal[RetellResponseType.RESPONSE] = RetellResponseType.RESPONSE
    response_id: int
    content: str
    content_complete: bool
    no_interruption_allowed: Optional[bool]
    end_call: Optional[bool]
    transfer_number: Optional[str]
    show_transferee_as_caller: Optional[bool]
    digit_to_press: Optional[str]
