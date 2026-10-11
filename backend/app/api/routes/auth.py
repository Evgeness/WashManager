# 5 эндпоинтов: register, login, refresh, logout, me.

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.crud import user as user_crud
from app.crud import refresh_token as rt_crud
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest, LoginRequest, RefreshRequest,
    TokenResponse, UserResponse,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# ===== РЕГИСТРАЦИЯ =====

@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Проверка уникальности email
    existing = user_crud.get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует",
        )

    # create_user хэширует пароль внутри
    user = user_crud.create_user(db, data)
    return user


# ===== ВХОД =====

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = user_crud.authenticate_user(db, data.email, data.password)
    if not user:
        # Не говорим, что именно неверно — email или пароль.
        # Это защита от enumeration-атак.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        )

    # Создаём оба токена. В sub — id пользователя.
    access = create_access_token({"sub": str(user.id)})
    refresh = create_refresh_token({"sub": str(user.id)})

    # Сохраняем refresh в БД, чтобы можно было отозвать.
    expires = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    rt_crud.save_refresh_token(db, refresh, user.id, expires)

    return TokenResponse(access_token=access, refresh_token=refresh)


# ===== ОБНОВЛЕНИЕ ACCESS =====

@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    """
    Обновляет access-токен по действующему refresh.
    
    Реализован механизм ROTATION:
    - старый refresh отзывается (revoked=True)
    - выдаётся новый refresh
    
    Это защищает от replay-атак: украденный refresh можно
    использовать только один раз.
    """
    # Шаг 1: проверка в БД (не отозван, не истёк)
    if not rt_crud.is_valid(db, data.refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh-токен недействителен или отозван",
        )

    # Шаг 2: проверка JWT-подписи и типа
    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Недействительный токен")

    # Шаг 3: отзываем старый refresh (rotation)
    rt_crud.revoke_refresh_token(db, data.refresh_token)

    # Шаг 4: создаём новую пару токенов
    user_id = int(payload["sub"])
    new_access = create_access_token({"sub": str(user_id)})
    new_refresh = create_refresh_token({"sub": str(user_id)})

    expires = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    rt_crud.save_refresh_token(db, new_refresh, user_id, expires)

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


# ===== ВЫХОД =====

@router.post("/logout", status_code=204)
def logout(
    data: RefreshRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← требует access-токен
):
    """
    Отзывает refresh-токен текущей сессии.
    
    Клиент должен после этого удалить оба токена из памяти.
    Сервер со своей стороны помечает refresh как revoked,
    так что его больше нельзя использовать для /refresh.
    """
    rt_crud.revoke_refresh_token(db, data.refresh_token)
    return None    # 204 No Content — без тела ответа


# ===== ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ =====

@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    """
    Возвращает текущего пользователя.
    
    Используется фронтом для:
    1. Восстановления сессии при F5 (если токен есть в памяти)
    2. Получения данных для отображения в шапке (имя, комната)
    """
    return current_user