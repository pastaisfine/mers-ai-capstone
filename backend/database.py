from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from environment import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)




