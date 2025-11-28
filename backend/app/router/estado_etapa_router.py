from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.db import get_db
from app.schema.estado_etapa import EstadoEtapaResponse, EstadoEtapaCreate
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


@router.post("/", response_model=EstadoEtapaResponse)
def create_estado_etapa(estado: EstadoEtapaCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo estado de etapa
    """
    nuevo_estado = EstadoEtapa(**estado.dict())
    db.add(nuevo_estado)
    db.commit()
    db.refresh(nuevo_estado)
    return nuevo_estado


@router.delete("/{estado_id}")
def delete_estado_etapa(estado_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un estado de etapa (también elimina sus actividades asociadas)
    """
    estado = db.query(EstadoEtapa).filter(EstadoEtapa.id == estado_id).first()
    if not estado:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    
    db.delete(estado)
    db.commit()
    return {"message": f"Estado '{estado.nombre}' y sus actividades eliminados correctamente"}