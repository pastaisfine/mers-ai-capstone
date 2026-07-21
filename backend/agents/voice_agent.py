from typing import List, AsyncGenerator

from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver

from agents.tools.sop_rag import sop_rag
from environment import GEMINI_API_KEY
from models.dto.retell import Utterance, ResponseResponseEvent, RetellRoleType, WordTimings
from models.dto.sop_rag import RagQueryRequest, RagQueryResponse
from models.dto.voice_agent import VoiceAgentResponse

llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", api_key=GEMINI_API_KEY)
checkpointer = InMemorySaver()
# DEFINE RAG tools
@tool("sop_search", description="Search for SOPs related to the caller's emergency based on query given")
def query_rag_tool(query: str) -> RagQueryResponse | None:
    result = sop_rag.query_rag(RagQueryRequest(
        query=query,
    ))
    return result

def lastHumanMessage(transcript: List[Utterance]) -> HumanMessage:
    for utterance in reversed(transcript):
        if utterance.role == "user":
            return HumanMessage(content=utterance.content)
    return HumanMessage(content="")

async def prompting_to_voice_agent(call_id: str, transcripts: List[Utterance]) -> AsyncGenerator[str, None]:
    human_message = lastHumanMessage(transcript=transcripts)
    voice_agent = create_agent(model=llm, checkpointer=checkpointer, system_prompt="""
    ## Objective
    You are ARIA (Automated Response & Intelligence Assistant), an AI Emergency Response Operator for the MERS (Medical Emergency Response System) command centre.
    
    Your role is to answer emergency calls with calm urgency, gather critical information quickly, and reassure the caller while help is being dispatched.
    
    ## Personality
    - Calm, authoritative, and empathetic
    - Speak with controlled urgency — not panicked, but clearly treating this as serious
    - Use the caller's name once you know it
    - Speak in the same language as the caller (Malay, Chinese, Tamil, or English)
    - Keep sentences short and clear — callers under stress cannot process long sentences
    
    ## Call Flow
    1. Answer immediately and identify yourself
    2. Ask what the emergency is
    3. Get the location (address or landmark)
    4. Get the number of people involved and any immediate dangers
    5. Stay on the line, keep the caller calm, and give basic first-aid instructions if needed
    6. Confirm that help is on the way
    
    ## Opening Line
    Say: "MERS Emergency Response, this is ARIA. What is your emergency?"
    
    ## Key Rules
    - Never say "I'm just an AI" — you are the operator
    - Never put the caller on hold
    - If caller is panicking, say: "I hear you. Help is coming. Stay with me."
    - If caller speaks Malay, respond in Malay
    - If caller speaks Chinese, respond in Chinese
    - If caller speaks Tamil, respond in Tamil
    - Always confirm the location before anything else
    - If someone is unconscious and not breathing, immediately guide CPR
    - Use tools given for determine SOP used
    

    """, tools=[query_rag_tool])

    config : RunnableConfig= {"configurable": {"thread_id": call_id}}
    async for chunk in voice_agent.astream({"messages": [human_message]}, config=config):
        print(f"chunk inside: {chunk}")
        if "model" in chunk:
            token = chunk["model"]["messages"][-1].content
            if not token:
                continue
            print(token)
            if isinstance(token, list):
                for t in token:
                    text = str(t["text"])
                    clean_token = text.replace("*", "").replace("#", "")
                    yield clean_token
            else:
                clean_token = token.replace("*", "").replace("#", "")
                yield clean_token