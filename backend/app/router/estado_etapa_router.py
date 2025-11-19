from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.db import get_db
from app.schema.estado_etapa import EstadoEtapaResponse
from app.model.estado_etapa import EstadoEtapa

router = APIRouter()

@router.get("/", response_model=List[EstadoEtapaResponse])
def get_estados_etapa(db: Session = Depends(get_db)):
    """
    Obtener todos los estados de etapa ordenados por su secuencia
    """
    estados = db.query(EstadoEtapa).order_by(EstadoEtapa.orden).all()
    return estados

@router.get("/{estado_id}", response_model=EstadoEtapaResponse)
def get_estado_etapa(estado_id: int, db: Session = Depends(get_db)):
    """
    Obtener un estado de etapa específico por ID
    """
    estado = db.query(EstadoEtapa).filter(EstadoEtapa.id == estado_id).first()
    if not estado:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    return estado
