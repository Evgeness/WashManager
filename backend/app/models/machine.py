from sqlalchemy import String, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum

# Enum для типа машины: стиральная или сушильная
class MachineType(str, enum.Enum):
    WASHER = "washer"
    DRYER = "dryer"

class Machine(Base):
    __tablename__ = "machines"

    # Первичный ключ
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Название (Стиральная машина №1)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Тип (washer/dryer)
    type: Mapped[MachineType] = mapped_column(Enum(MachineType), nullable=False)
    
    # Статус (свободна/занята/не работает)
    status: Mapped[str] = mapped_column(String(20), default="free")

    # Связь: одна машина — много броней
    # back_populates обеспечивает двустороннюю связь (booking.machine)
    bookings: Mapped[list["Booking"]] = relationship(
        "Booking", back_populates="machine", cascade="all, delete-orphan"
    )