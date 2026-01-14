from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.model.tipo_gasto import TipoGasto
from app.schema.tipo_gasto import TipoGastoResponse

router = APIRouter()

@router.get("/", response_model=List[TipoGastoResponse])
def obtener_tipos_gasto(db: Session = Depends(get_db)):
    """
    Obtiene todos los tipos de gasto disponibles.
    """
    tipos_gasto = db.query(TipoGasto).all()
    return tipos_gasto

@router.get("/{id_tipo_gasto}", response_model=TipoGastoResponse)
def obtener_tipo_gasto(id_tipo_gasto: int, db: Session = Depends(get_db)):
    """
    Obtiene un tipo de gasto específico por su ID.
    """
    tipo_gasto = db.query(TipoGasto).filter(TipoGasto.id == id_tipo_gasto).first()
    if not tipo_gasto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tipo de gasto con id {id_tipo_gasto} no encontrado"
        )
    return tipo_gasto
