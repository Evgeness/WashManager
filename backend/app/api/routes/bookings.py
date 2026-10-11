from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse
from app.crud import booking as crud

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# ===== ПОЛУЧЕНИЕ СПИСКА СВОИХ БРОНЕЙ =====

@router.get("/", response_model=list[BookingResponse])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← защита
):
    """
    Список броней текущего пользователя.
    Возвращает только брони, где user_id == current_user.id.
    """
    all_bookings = crud.get_bookings(db)
    return [b for b in all_bookings if b.user_id == current_user.id]


# ===== СОЗДАНИЕ БРОНИ =====

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← защита
):
    """
    Создать бронь.
    user_id автоматически подставляется из текущего пользователя.
    """
    # Принудительно устанавливаем user_id текущего пользователя —
    # нельзя создать бронь от имени другого
    booking_data = data.model_dump()
    booking_data["user_id"] = current_user.id

    return crud.create_booking(db, booking_data)


# ===== ОБНОВЛЕНИЕ БРОНИ =====

@router.patch("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    data: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← защита
):
    """Обновить бронь — только владелец."""
    booking = crud.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Бронь не найдена",
        )

    # Проверка владельца
    # Двухуровневая защита:
    # 401 (нет токена) уже отработал в Depends.
    # Теперь проверяем 403 — что это НАША бронь
    
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав на эту бронь",
        )

    return crud.update_booking(db, booking_id, data)


# ===== УДАЛЕНИЕ БРОНИ =====

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← защита
):
    """Удалить бронь — только владелец."""
    booking = crud.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Бронь не найдена",
        )

    # Проверка владельца
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет прав на эту бронь",
        )

    crud.delete_booking(db, booking_id)