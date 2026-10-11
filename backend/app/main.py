from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

# Импорт всех моделей — чтобы SQLAlchemy видел таблицы
from app.models import machine, booking, user, refresh_token  # noqa

from app.api.routes import auth, machines, bookings

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)


# ===== CORS =====
# Middleware нужно добавлять ДО include_router.
# allow_methods=["*"] обязательно включает OPTIONS — без него браузер
# не сможет сделать preflight и все POST-запросы будут падать.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],       #включает OPTIONS
    allow_headers=["*"],       #включает Content-Type и Authorization
)

# ===== ПОДКЛЮЧЕНИЕ РОУТОВ =====
app.include_router(auth.router)
app.include_router(machines.router)
app.include_router(bookings.router)


@app.get("/")
def root():
    return {"message": "WashManager API работает", "docs": "/docs"}