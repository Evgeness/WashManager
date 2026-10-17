from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse
from app.crud import booking as crud
from app.models.booking import Booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# 1. Все брони (для расписания)
@router.get("/all", response_model=list[BookingResponse])
def list_all_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bookings = crud.get_bookings(db)
    # Подтягиваем имена машин
    for b in bookings:
        b.machine_name = b.machine.name if b.machine else f"Машина №{b.machine_id}"
    return bookings

# 2. Только мои брони
@router.get("/", response_model=list[BookingResponse])
def list_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bookings = crud.get_bookings(db)
    my_bookings = [b for b in bookings if b.user_id == current_user.id]
    for b in my_bookings:
        b.machine_name = b.machine.name if b.machine else f"Машина №{b.machine_id}"
    return my_bookings

# 3. Создание (теперь поддерживает статус queued)
@router.post("/", response_model=BookingResponse, status_code=201)
def create_booking(data: BookingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_bookings = crud.get_bookings(db)

    # 1. ПРОВЕРКА: не бронировал ли этот же пользователь уже этот слот?
    user_already_booked = any(
        b.machine_id == data.machine_id 
        and b.user_id == current_user.id 
        and b.start_time == data.start_time 
        for b in existing_bookings
    )
    if user_already_booked:
        raise HTTPException(
            status_code=400, 
            detail="Вы уже забронировали этот слот (или стоите в очереди)"
        )

    # 2. ПРОВЕРКА: занят ли слот кем-то другим (активная бронь)?
    is_occupied = any(
        b.machine_id == data.machine_id 
        and b.start_time == data.start_time 
        and b.end_time == data.end_time 
        and b.status == 'active'
        for b in existing_bookings
    )

    booking_data = data.model_dump()
    booking_data["user_id"] = current_user.id
    
    # Если занято — ставим в очередь, иначе делаем активной
    booking_data["status"] = "queued" if is_occupied else "active"

    booking = crud.create_booking(db, booking_data)
    booking.machine_name = booking.machine.name if booking.machine else f"Машина №{booking.machine_id}"
    return booking

# 4. Отмена (удаление)
@router.delete("/{booking_id}", status_code=204)
def delete_booking(booking_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    booking = crud.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(404, "Бронь не найдена")
    if booking.user_id != current_user.id:
        raise HTTPException(403, "Нет прав на эту бронь")
    
    # 1. Запоминаем, была ли это активная бронь
    was_active = booking.status == 'active'
    machine_id = booking.machine_id
    start_time = booking.start_time
    end_time = booking.end_time

    # 2. Удаляем текущую бронь
    crud.delete_booking(db, booking_id)
    db.commit() # Жестко фиксируем удаление

    # 3. КАСКАДНОЕ ПРОДВИЖЕНИЕ: Если отменилась активная бронь
    if was_active:
        # Ищем самого первого человека в очереди на этот же слот
        next_in_queue = db.query(Booking).filter(
            Booking.machine_id == machine_id,
            Booking.start_time == start_time,
            Booking.end_time == end_time,
            Booking.status == 'queued'
        ).order_by(Booking.id.asc()).first() # order_by id — кто раньше встал, тот и первый

        # Если кто-то есть в очереди — делаем его активным
        if next_in_queue:
            next_in_queue.status = 'active'
            db.commit()
            db.refresh(next_in_queue)
            print(f"DEBUG: Бронь пользователя {next_in_queue.user_id} повышена до ACTIVE!")