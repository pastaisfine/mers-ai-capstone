from sqlalchemy import event

from models.schema import AIEmotionAnalysis

@event.listens_for(AIEmotionAnalysis, "after_insert")
def after_insert_listener(mapper, connection, target):
    "send sse event"
    print(f"Notification: New user registered with ID: {target.id}")