# Pydantic Settings — читает переменные из .env
# и валидирует их типы. Если чего-то не хватает — упадёт с понятной ошибкой.
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Параметры подключения к БД
    # Пример строки: postgresql://user:password@localhost:5432/washmanager
    DATABASE_URL: str = "postgresql://postgres:1234@localhost:3000/washmanager"

    # Настройки API
    APP_NAME: str = "WashManager API"
    DEBUG: bool = True

    # Модель читает .env из корня backend/
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Единственный экземпляр настроек на всё приложение
settings = Settings()