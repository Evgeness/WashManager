from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Внешний ключ на User (для лабы можно упростить до строки)
    user_name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_room: Mapped[str] = mapped_column(String(20), nullable=False)
    
    # Внешний ключ на Machine (связь many-to-one)
    machine_id: Mapped[int] = mapped_column(ForeignKey("machines.id"), nullable=False)
    
    # Время начала и конца брони
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    # Статус: active, queued, completed
    status: Mapped[str] = mapped_column(String(20), default="active")

    # Обратная связь на Machine
    machine: Mapped["Machine"] = relationship("Machine", back_populates="bookings")