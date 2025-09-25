from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import estado_etapa as model_estado_etapa
from ..schema import estado_etapa as schema_estado_etapa
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_estado_etapa.EstadoEtapa)
def create_estado_etapa(estado_etapa: schema_estado_etapa.EstadoEtapaCreate, db: Session = Depends(get_db)):
    db_estado_etapa = model_estado_etapa.EstadoEtapa(**estado_etapa.dict())
    db.add(db_estado_etapa)
    db.commit()
    db.refresh(db_estado_etapa)
    return db_estado_etapa

@router.get("/", response_model=List[schema_estado_etapa.EstadoEtapa])
def read_estados_etapa(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    estados_etapa = db.query(model_estado_etapa.EstadoEtapa).offset(skip).limit(limit).all()
    return estados_etapa

@router.get("/{estado_etapa_id}", response_model=schema_estado_etapa.EstadoEtapa)
def read_estado_etapa(estado_etapa_id: int, db: Session = Depends(get_db)):
    db_estado_etapa = db.query(model_estado_etapa.EstadoEtapa).filter(model_estado_etapa.EstadoEtapa.id == estado_etapa_id).first()
    if db_estado_etapa is None:
        raise HTTPException(status_code=404, detail="Estado de etapa no encontrado")
    return db_estado_etapa

@router.put("/{estado_etapa_id}", response_model=schema_estado_etapa.EstadoEtapa)
def update_estado_etapa(estado_etapa_id: int, estado_etapa: schema_estado_etapa.EstadoEtapaUpdate, db: Session = Depends(get_db)):
    db_estado_etapa = db.query(model_estado_etapa.EstadoEtapa).filter(model_estado_etapa.EstadoEtapa.id == estado_etapa_id).first()
    if db_estado_etapa is None:
        raise HTTPException(status_code=404, detail="Estado de etapa no encontrado")
    
    for key, value in estado_etapa.dict(exclude_unset=True).items():
        setattr(db_estado_etapa, key, value)
    
    db.commit()
    db.refresh(db_estado_etapa)
    return db_estado_etapa

@router.delete("/{estado_etapa_id}", response_model=schema_estado_etapa.EstadoEtapa)
def delete_estado_etapa(estado_etapa_id: int, db: Session = Depends(get_db)):
    db_estado_etapa = db.query(model_estado_etapa.EstadoEtapa).filter(model_estado_etapa.EstadoEtapa.id == estado_etapa_id).first()
    if db_estado_etapa is None:
        raise HTTPException(status_code=404, detail="Estado de etapa no encontrado")
    
    db.delete(db_estado_etapa)
    db.commit()
    return db_estado_etapa
