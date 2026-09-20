from pydantic import BaseModel, ConfigDict

# Базовая схема (общие поля)
class MachineBase(BaseModel):
    name: str
    type: str
    status: str = "free"

# Схема для создания (POST) — что приходит от клиента
class MachineCreate(MachineBase):
    pass

# Схема для обновления (PATCH) — все поля опциональны
class MachineUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    status: str | None = None

# Схема для ответа (GET) — что уходит клиенту
class MachineResponse(MachineBase):
    id: int
    
    # from_attributes=True позволяет Pydantic читать данные 
    # прямо из ORM-объекта SQLAlchemy.
    model_config = ConfigDict(from_attributes=True)