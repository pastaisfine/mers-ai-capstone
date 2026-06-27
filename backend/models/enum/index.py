import enum


class IncidentType(enum.Enum):
    medical = "medical"
    fire = "fire"
    crime = "crime"
    accident = "accident"
    flood = "flood"