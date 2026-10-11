from pydantic import BaseModel, EmailStr, Field


# ===== ЗАПРОСЫ =====

class RegisterRequest(BaseModel):
    """Тело запроса POST /auth/register."""
    # Field(...) — три точки = обязательное поле
    # min_length=2 — хотя бы имя + фамилия
    full_name: str = Field(..., min_length=2, max_length=100)

    # pattern — регулярка: только цифры, от 1 до 4 символов
    # r"..." — raw-строка, чтобы \d не превратился в escape-последовательность
    room: str = Field(..., pattern=r"^\d{1,4}$")

    # EmailStr — специальный тип Pydantic. Требует пакет email-validator.
    # Автоматически проверяет, что это валидный email.
    email: EmailStr

    # min_length=6 — базовая защита от «123»
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    """Тело запроса POST /auth/login."""
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    """Тело запроса POST /auth/refresh и POST /auth/logout."""
    refresh_token: str


# ===== ОТВЕТЫ =====

class TokenResponse(BaseModel):
    """Ответ на успешный login или refresh."""
    access_token: str
    refresh_token: str
    # token_type = "bearer" — стандарт OAuth2. Клиент должен
    # добавлять заголовок "Authorization: Bearer <access_token>"
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Публичные данные пользователя (БЕЗ пароля и хэша)."""
    id: int
    full_name: str
    room: str
    email: str

    # from_attributes=True — Pydantic может читать поля прямо из ORM-объекта.
    model_config = {"from_attributes": True}