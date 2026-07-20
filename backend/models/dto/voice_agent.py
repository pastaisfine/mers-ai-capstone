from typing import Optional, Any

from pydantic import BaseModel

from models.enum.index import SeverityType


# {
#        "content": "...",    // Message that agent replied to victim which matches the caller's language and SOP
#        "incident_update": {
#            "title": "...", // Title of the incident if able to determined, else no need to set
#            "ai_summary": "...", // Summary of the incident if able to determined, else no need to set
#            "severity": "...", // Severity of the incident (Only allowed values are "CRITICAL", "URGENT", "MODERATE", "RESOLVED") if able to determined, else no need to set
#            "priority": "...", // Priority of the incident based on SOP given if able to determined, else no need to set
#            "sop_citation": "...", // SOP citation for the incident based on SOP given if able to determined, else no need to set
#            "sop_procedure": "...", // SOP procedure for the incident based on SOP given if able to determined, else no need to set
#         }
#    }

class IncidentUpdatePayload(BaseModel):
    title: Optional[str]
    ai_summary: Optional[str]
    severity: Optional[SeverityType]
    priority: Optional[int]
    sop_citation: Optional[str]
    sop_procedure: Optional[dict[str, Any]]


class VoiceAgentResponse(BaseModel):
    content: str
    incident_update:IncidentUpdatePayload