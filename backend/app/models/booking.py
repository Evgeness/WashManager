from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_room: Mapped[str] = mapped_column(String(20), nullable=False)
    
    # --- Связь с машиной ---
    machine_id: Mapped[int] = mapped_column(ForeignKey("machines.id"), nullable=False)
    
    # --- Связь с пользователем ---
    # Внешний ключ на users.id — привязывает бронь к конкретному пользователю.
    # Это позволяет:
    # 1. Фильтровать брони по пользователю (GET /bookings/)
    # 2. Проверять права при удалении (403, если чужая)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active")

    # --- Двусторонние связи ---
    machine: Mapped["Machine"] = relationship("Machine", back_populates="bookings")
    user: Mapped["User"] = relationship("User", back_populates="bookings") 