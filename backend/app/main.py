from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


from app.models import machine, booking  # noqa

from app.api.routes import machines, bookings

# Создаём таблицы при старте.
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

# Разрешаем CORS, чтобы фронтенд (localhost:3000) мог обращаться к API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роуты
app.include_router(machines.router)
app.include_router(bookings.router)

@app.get("/")
def root():
    return {"message": "WashManager API работает", "docs": "/docs"}