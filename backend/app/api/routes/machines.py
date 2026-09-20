from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.machine import MachineCreate, MachineUpdate, MachineResponse
from app.crud import machine as crud

router = APIRouter(prefix="/machines", tags=["Machines"])

@router.get("/", response_model=list[MachineResponse])
def list_machines(db: Session = Depends(get_db)):
    return crud.get_machines(db)

@router.get("/{machine_id}", response_model=MachineResponse)
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    machine = crud.get_machine(db, machine_id)
    if not machine:
        # 404 — стандартный HTTP-код для "не найдено"
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Машина не найдена")
    return machine

@router.post("/", response_model=MachineResponse, status_code=status.HTTP_201_CREATED)
def create_machine(data: MachineCreate, db: Session = Depends(get_db)):
    return crud.create_machine(db, data)

@router.patch("/{machine_id}", response_model=MachineResponse)
def update_machine(machine_id: int, data: MachineUpdate, db: Session = Depends(get_db)):
    machine = crud.update_machine(db, machine_id, data)
    if not machine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Машина не найдена")
    return machine

@router.delete("/{machine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(machine_id: int, db: Session = Depends(get_db)):
    if not crud.delete_machine(db, machine_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Машина не найдена")  