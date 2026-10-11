from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.refresh_token import RefreshToken


def save_refresh_token(
    db: Session, token: str, user_id: int, expires_at: datetime
) -> RefreshToken:
    """Сохраняет выпущенный refresh-токен в БД."""
    rt = RefreshToken(token=token, user_id=user_id, expires_at=expires_at)
    db.add(rt)
    db.commit()
    db.refresh(rt)
    return rt


def get_refresh_token(db: Session, token: str) -> RefreshToken | None:
    """Находит запись токена по строке JWT."""
    return db.query(RefreshToken).filter(RefreshToken.token == token).first()


def revoke_refresh_token(db: Session, token: str) -> bool:
    """
    Помечает токен как отозванный.
    Используется при logout и при rotation в /refresh.
    """
    rt = get_refresh_token(db, token)
    if not rt:
        return False
    rt.revoked = True
    db.commit()
    return True


def is_valid(db: Session, token: str) -> bool:
    """
    Комплексная проверка refresh-токена:
    1. Есть ли в БД
    2. Не отозван ли
    3. Не истёк ли
    
    Возвращает True только если ВСЕ три условия выполнены.
    """
    rt = get_refresh_token(db, token)
    if not rt:
        return False
    if rt.revoked:
        return False
    # Сравниваем с текущим временем UTC
    if rt.expires_at < datetime.now(timezone.utc):
        return False
    return True