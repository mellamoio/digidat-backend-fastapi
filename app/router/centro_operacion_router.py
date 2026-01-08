from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.db import get_db
from app.model.centro_operacion import CentroOperacion
from pydantic import BaseModel

router = APIRouter()

class CentroOperacionResponse(BaseModel):
    id: int
    nombre: str
    
    class Config:
        from_attributes = True

class CentroOperacionCreate(BaseModel):
    nombre: str

@router.get("/", response_model=List[CentroOperacionResponse])
def get_centros_operacion(db: Session = Depends(get_db)):
    """
    Obtener todos los centros de operación
    """
    centros = db.query(CentroOperacion).all()
    return centros

@router.post("/", response_model=CentroOperacionResponse, status_code=201)
def create_centro_operacion(centro: CentroOperacionCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo centro de operación
    """
    new_centro = CentroOperacion(nombre=centro.nombre)
    db.add(new_centro)
    db.commit()
    db.refresh(new_centro)
    return new_centro

@router.delete("/{centro_id}")
def delete_centro_operacion(centro_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un centro de operación
    """
    centro = db.query(CentroOperacion).filter(CentroOperacion.id == centro_id).first()
    if not centro:
        raise HTTPException(status_code=404, detail="Centro de operación no encontrado")
    
    db.delete(centro)
    db.commit()
    return {"message": "Centro de operación eliminado correctamente"}