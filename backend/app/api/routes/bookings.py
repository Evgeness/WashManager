from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse
from app.crud import booking as crud

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("/", response_model=list[BookingResponse])
def list_bookings(db: Session = Depends(get_db)):
    return crud.get_bookings(db)

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    return crud.create_booking(db, data)

@router.patch("/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: int, data: BookingUpdate, db: Session = Depends(get_db)):
    booking = crud.update_booking(db, booking_id, data)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Бронь не найдена")
    return booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    if not crud.delete_booking(db, booking_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Бронь не найдена")