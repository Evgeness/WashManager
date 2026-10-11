# Pydantic Settings — читает переменные из .env
# и валидирует их типы. Если чего-то не хватает — упадёт с понятной ошибкой.
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Параметры подключения к БД
    DATABASE_URL: str = "postgresql://postgres:1234@localhost:3000/washmanager"

    # --- JWT ---
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_RANDOM_64_CHARS"

    # Алгоритм подписи JWT (HS256 — симметричный, HMAC + SHA-256)
    ALGORITHM: str = "HS256"
    
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30          # access — 30 минут
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7             # refresh — 7 дней

    # Настройки API
    APP_NAME: str = "WashManager API"
    DEBUG: bool = True

    # Модель читает .env из корня backend/
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Единственный экземпляр настроек на всё приложение
settings = Settings()