from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.machine import MachineCreate, MachineUpdate, MachineResponse
from app.crud import machine as crud

router = APIRouter(prefix="/machines", tags=["Machines"])


# ===== ПУБЛИЧНЫЕ МАРШРУТЫ (без авторизации) =====

@router.get("/", response_model=list[MachineResponse])
def list_machines(db: Session = Depends(get_db)):
    """Список машин — доступен всем, даже неавторизованным."""
    return crud.get_machines(db)


@router.get("/{machine_id}", response_model=MachineResponse)
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    """Получить машину по ID — доступен всем."""
    machine = crud.get_machine(db, machine_id)
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Машина не найдена",
        )
    return machine


# ===== ПРИВАТНЫЕ МАРШРУТЫ (требуют access-токен) =====

@router.post("/", response_model=MachineResponse, status_code=status.HTTP_201_CREATED)
def create_machine(
    data: MachineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← защита
):
    """Создать машину — только для авторизованных."""
    return crud.create_machine(db, data)


@router.patch("/{machine_id}", response_model=MachineResponse)
def update_machine(
    machine_id: int,
    data: MachineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← защита
):
    """Обновить машину — только для авторизованных."""
    machine = crud.update_machine(db, machine_id, data)
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Машина не найдена",
        )
    return machine


@router.delete("/{machine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(
    machine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),   # ← защита
):
    """Удалить машину — только для авторизованных."""
    if not crud.delete_machine(db, machine_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Машина не найдена",
        )