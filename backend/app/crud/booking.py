from sqlalchemy.orm import Session
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingUpdate

def create_booking(db: Session, data: BookingCreate) -> Booking:
    booking = Booking(**data.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def get_bookings(db: Session):
    return db.query(Booking).all()

def get_booking(db: Session, booking_id: int) -> Booking | None:
    return db.query(Booking).filter(Booking.id == booking_id).first()

def update_booking(db: Session, booking_id: int, data: BookingUpdate) -> Booking | None:
    booking = get_booking(db, booking_id)
    if not booking:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)
    db.commit()
    db.refresh(booking)
    return booking

def delete_booking(db: Session, booking_id: int) -> bool:
    booking = get_booking(db, booking_id)
    if not booking:
        return False
    db.delete(booking)
    db.commit()
    return True