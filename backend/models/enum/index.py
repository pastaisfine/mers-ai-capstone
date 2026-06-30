import enum


class IncidentType(str, enum.Enum):
    medical = "medical"
    fire = "fire"
    crime = "crime"
    accident = "accident"
    flood = "flood"

class SeverityType(str, enum.Enum):
    CRITICAL = "CRITICAL"
    URGENT = "URGENT"
    MODERATE = "MODERATE"
    RESOLVED = "RESOLVED"