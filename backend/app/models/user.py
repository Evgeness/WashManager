from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    
    # Mapped — это обобщённый (generic), который описывает тип поля модели и одновременно сообщает SQLAlchemy, что это колонка таблицы

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # nullable=False — поле обязательно
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)

    room: Mapped[str] = mapped_column(String(10), nullable=False)

    # unique=True — нельзя зарегистрироваться с тем же email
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)

    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # --- Связь с бронями (One-to-Many) ---
    # back_populates — двусторонняя связь: user.bookings и booking.user
    # ВАЖНО: чтобы эта связь работала, в Booking должен быть user_id с ForeignKey
    bookings: Mapped[list["Booking"]] = relationship("Booking", back_populates="user")