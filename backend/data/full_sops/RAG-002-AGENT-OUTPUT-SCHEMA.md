## RAG-002-AGENT-OUTPUT-SCHEMA - Recommended SOP Agent JSON Output Schema

**Tags:** JSON, agent output, structured response, LangGraph, supervisor agent

The SOP RAG Agent should return a structured object to the Supervisor Agent instead of free-form text. The voice layer can then convert the caller_instruction into natural speech.

Example schema:
{
  "sop_id": "MED-001-CARDIAC-ARREST",
  "retrieval_confidence": 0.91,
  "priority": "P1_IMMEDIATE_LIFE_THREAT",
  "incident_category": "Medical",
  "suspected_subtype": "Cardiac arrest",
  "immediate_dispatch_recommendation": ["ALS ambulance"],
  "caller_safety_check": "Scene appears safe based on caller response; verify again if environment changes.",
  "next_question": "Is he breathing normally - yes or no?",
  "caller_instruction": "Put the phone on speaker. Lay him flat on his back. Put your hands in the centre of the chest and push hard and fast.",
  "responder_handoff": "Adult male collapsed, caller reports not breathing. CPR being started. Exact location confirmed.",
  "must_not_say": ["He is dead", "Wait until ambulance arrives before doing anything"],
  "escalate_to_human": false,
  "missing_fields": ["patient age", "AED availability"]
}

The agent should not produce a long paragraph when a short operational object is enough. In a real-time voice call, latency and clarity are safety features.
