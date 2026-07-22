from typing import List

from agents.voice_agent import prompting_to_voice_agent
from models.dto.retell import Utterance, RetellRoleType, WordTimings

transcript: List[Utterance] = [
    Utterance(
        role=RetellRoleType.USER,
        content="Help! My apartment is on fire! 742 Evergreen Terrace, Apartment 3B!",
        words=[
            WordTimings(word="Help!", start=2.8, end=3.1),
            WordTimings(word="My", start=3.2, end=3.35),
            WordTimings(word="apartment", start=3.4, end=3.85),
            WordTimings(word="is", start=3.9, end=4.0),
            WordTimings(word="on", start=4.05, end=4.15),
            WordTimings(word="fire!", start=4.2, end=4.6),
            WordTimings(word="742", start=4.8, end=5.2),
            WordTimings(word="Evergreen", start=5.25, end=5.7),
            WordTimings(word="Terrace,", start=5.75, end=6.1),
            WordTimings(word="Apartment", start=6.2, end=6.6),
            WordTimings(word="3B!", start=6.65, end=7.0),
        ],
    ),
    Utterance(
        role=RetellRoleType.USER,
        content="No, the hallway is full of heavy black smoke. I can't open the door!",
        words=[
            WordTimings(word="No,", start=12.1, end=12.4),
            WordTimings(word="the", start=12.5, end=12.6),
            WordTimings(word="hallway", start=12.65, end=13.0),
            WordTimings(word="is", start=13.05, end=13.15),
            WordTimings(word="full", start=13.2, end=13.4),
            WordTimings(word="of", start=13.45, end=13.55),
            WordTimings(word="heavy", start=13.6, end=13.85),
            WordTimings(word="black", start=13.9, end=14.15),
            WordTimings(word="smoke.", start=14.2, end=14.6),
            WordTimings(word="I", start=14.8, end=14.9),
            WordTimings(word="can't", start=14.95, end=15.2),
            WordTimings(word="open", start=15.25, end=15.5),
            WordTimings(word="the", start=15.55, end=15.65),
            WordTimings(word="door!", start=15.7, end=16.0),
        ],
    ),
    Utterance(
        role=RetellRoleType.USER,
        content="I'm doing that now. I'm alone, but I can hear sirens in the distance—are they close?",
        words=[
            WordTimings(word="I'm", start=25.6, end=25.75),
            WordTimings(word="doing", start=25.8, end=26.05),
            WordTimings(word="that", start=26.1, end=26.25),
            WordTimings(word="now.", start=26.3, end=26.6),
            WordTimings(word="I'm", start=26.8, end=26.95),
            WordTimings(word="alone,", start=27.0, end=27.4),
            WordTimings(word="but", start=27.5, end=27.65),
            WordTimings(word="I", start=27.7, end=27.8),
            WordTimings(word="can", start=27.85, end=28.0),
            WordTimings(word="hear", start=28.05, end=28.25),
            WordTimings(word="sirens", start=28.3, end=28.7),
            WordTimings(word="in", start=28.75, end=28.85),
            WordTimings(word="the", start=28.9, end=29.0),
            WordTimings(word="distance—are", start=29.05, end=29.6),
            WordTimings(word="they", start=29.65, end=29.8),
            WordTimings(word="close?", start=29.85, end=30.2),
        ],
    ),
]

current_transcript = [
Utterance(
        role=RetellRoleType.AGENT,
        content="MERS Emergency Response, this is ARIA. What is your emergency?",
        words=[],
    ),
]

for utterance in transcript:
    prompting_to_voice_agent("test", transcript)
    current_transcript.append(utterance)
