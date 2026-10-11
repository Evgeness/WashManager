from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.schemas.auth import RegisterRequest


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, data: RegisterRequest) -> User:
    user = User(
        full_name=data.full_name,
        room=data.room,
        email=data.email,
        hashed_password=hash_password(data.password),   # ← хэшируем
    )
    db.add(user) # добавляем в сессию
    db.commit()  # фиксируем транзакцию
    db.refresh(user) # обновляем из БД (получаем сгенерированный id)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user