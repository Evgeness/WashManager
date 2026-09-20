from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# create_engine — создаёт пул соединений с БД
# pool_pre_ping=True — проверяет живое ли соединение перед использованием
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# SessionLocal — фабрика сессий. Каждый запрос получит свою сессию.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)