from sqlalchemy.orm import Session
from app.models.machine import Machine
from app.schemas.machine import MachineCreate, MachineUpdate

# CREATE
def create_machine(db: Session, data: MachineCreate) -> Machine:
    machine = Machine(**data.model_dump())
    db.add(machine)
    db.commit()
    db.refresh(machine)   # Обновляем, чтобы получить id
    return machine

# READ (все)
def get_machines(db: Session):
    return db.query(Machine).all()

# READ (одна)
def get_machine(db: Session, machine_id: int) -> Machine | None:
    return db.query(Machine).filter(Machine.id == machine_id).first()

# UPDATE
def update_machine(db: Session, machine_id: int, data: MachineUpdate) -> Machine | None:
    machine = get_machine(db, machine_id)
    if not machine:
        return None
    # exclude_unset=True — обновляем только переданные поля
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(machine, field, value)
    db.commit()
    db.refresh(machine)
    return machine

# DELETE
def delete_machine(db: Session, machine_id: int) -> bool:
    machine = get_machine(db, machine_id)
    if not machine:
        return False
    db.delete(machine)
    db.commit()
    return True