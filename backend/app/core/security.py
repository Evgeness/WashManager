from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings


# Контекст для хэширования паролей через bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ===== ПАРОЛИ =====

def hash_password(password: str) -> str:
    """Превращает пароль в bcrypt-хэш."""
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Проверяет, соответствует ли пароль хэшу."""
    return pwd_context.verify(plain, hashed)


# ===== JWT =====

def create_access_token(data: dict[str, Any]) -> str:
    """Создаёт короткоживущий access-токен."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    # Добавляем стандартный claim exp и кастомный type
    to_encode.update({"exp": expire, "type": "access"})

    # Подписываем SECRET_KEY с алгоритмом HS256
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict[str, Any]) -> str:
    """Создаёт долгоживущий refresh-токен."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict | None:
    """Декодирует и валидирует JWT. Возвращает payload или None."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None