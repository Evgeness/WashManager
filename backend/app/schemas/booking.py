from datetime import datetime
from pydantic import BaseModel, ConfigDict

class BookingBase(BaseModel):
    user_name: str
    user_room: str
    machine_id: int
    start_time: datetime
    end_time: datetime

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    start_time: datetime | None = None
    end_time: datetime | None = None
    status: str | None = None

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: str
    machine_name: str | None = None  # <--- ДОБАВИЛИ

    model_config = ConfigDict(from_attributes=True)