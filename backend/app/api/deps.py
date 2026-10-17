# ===== Зависимости FastAPI =====
# Здесь лежат функции, которые FastAPI вызывает перед обработкой запроса:
# - get_db — даёт сессию БД и закрывает её после ответа
# - get_current_user — проверяет JWT и возвращает текущего пользователя

from typing import Generator
from fastapi import Depends, HTTPException, status
# ИЗМЕНЕНИЕ 1: Используем HTTPBearer вместо OAuth2PasswordBearer
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.core.security import decode_token
from app.crud.user import get_user_by_id
from app.models.user import User


# ===== СЕССИЯ БД =====

def get_db() -> Generator:
    """Даёт сессию БД и гарантированно закрывает её после ответа."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===== АУТЕНТИФИКАЦИЯ =====

# ИЗМЕНЕНИЕ 2: HTTPBearer просит Swagger UI просто вставить токен.
# (OAuth2PasswordBearer заставлял Swagger показывать форму логина/пароля)
security = HTTPBearer()


def get_current_user(
    # ИЗМЕНЕНИЕ 3: Принимаем credentials вместо простой строки token
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Проверяет access-токен и возвращает текущего пользователя.
    Используется для защиты приватных маршрутов:
    
        @router.get("/protected")
        def protected(user: User = Depends(get_current_user)):
            ...
    """
    # ИЗМЕНЕНИЕ 4: Достаем сам токен из объекта credentials
    token = credentials.credentials

    # Ошибка 401 — единый ответ для всех случаев невалидного токена
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Недействительный токен",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 1. Декодируем и валидируем JWT (подпись + срок)
    payload = decode_token(token)
    if not payload:
        raise credentials_exception

    # 2. Проверяем, что это именно access-токен, а не refresh
    if payload.get("type") != "access":
        raise credentials_exception

    # 3. Достаём id пользователя из поля sub
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # 4. Загружаем пользователя из БД
    user = get_user_by_id(db, int(user_id))
    if user is None:
        raise credentials_exception

    return user