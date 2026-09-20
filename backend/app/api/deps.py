# Зависимость FastAPI, которая даёт роутам сессию БД
# и автоматически закрывает её после обработки запроса.
from typing import Generator
from app.db.session import SessionLocal

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db       # Отдаём сессию роуту
    finally:
        db.close()     # Гарантированно закрываем после ответа