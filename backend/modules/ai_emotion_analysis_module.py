from uuid_v7.base import uuid7

from main import db_dependency
from models.database.ai_emotion_analysis import InitAiEmotionAnalysisPayload
from models.schema import AIEmotionAnalysis
from modules import db_module

def init_ai_emotion_analysis(payload: InitAiEmotionAnalysisPayload, db: db_dependency):
    ai_emotion_analysis_payload = (payload.model_dump() | {"id": uuid7()})
    new_ai_emotion_analysis = db_module.init_data(ai_emotion_analysis_payload, db, AIEmotionAnalysis)
    return new_ai_emotion_analysis