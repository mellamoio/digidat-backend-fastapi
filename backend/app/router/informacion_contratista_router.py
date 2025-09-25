from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import informacion_contratista as model_informacion_contratista
from ..schema import informacion_contratista as schema_informacion_contratista
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_informacion_contratista.InformacionContratista)
def create_informacion_contratista(informacion_contratista: schema_informacion_contratista.InformacionContratistaCreate, db: Session = Depends(get_db)):
    db_informacion_contratista = model_informacion_contratista.InformacionContratista(**informacion_contratista.dict())
    db.add(db_informacion_contratista)
    db.commit()
    db.refresh(db_informacion_contratista)
    return db_informacion_contratista

@router.get("/", response_model=List[schema_informacion_contratista.InformacionContratista])
def read_informaciones_contratista(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    informaciones_contratista = db.query(model_informacion_contratista.InformacionContratista).offset(skip).limit(limit).all()
    return informaciones_contratista

@router.get("/{informacion_contratista_id}", response_model=schema_informacion_contratista.InformacionContratista)
def read_informacion_contratista(informacion_contratista_id: int, db: Session = Depends(get_db)):
    db_informacion_contratista = db.query(model_informacion_contratista.InformacionContratista).filter(model_informacion_contratista.InformacionContratista.id == informacion_contratista_id).first()
    if db_informacion_contratista is None:
        raise HTTPException(status_code=404, detail="Información de contratista no encontrada")
    return db_informacion_contratista

@router.put("/{informacion_contratista_id}", response_model=schema_informacion_contratista.InformacionContratista)
def update_informacion_contratista(informacion_contratista_id: int, informacion_contratista: schema_informacion_contratista.InformacionContratistaUpdate, db: Session = Depends(get_db)):
    db_informacion_contratista = db.query(model_informacion_contratista.InformacionContratista).filter(model_informacion_contratista.InformacionContratista.id == informacion_contratista_id).first()
    if db_informacion_contratista is None:
        raise HTTPException(status_code=404, detail="Información de contratista no encontrada")
    
    for key, value in informacion_contratista.dict(exclude_unset=True).items():
        setattr(db_informacion_contratista, key, value)
    
    db.commit()
    db.refresh(db_informacion_contratista)
    return db_informacion_contratista

@router.delete("/{informacion_contratista_id}", response_model=schema_informacion_contratista.InformacionContratista)
def delete_informacion_contratista(informacion_contratista_id: int, db: Session = Depends(get_db)):
    db_informacion_contratista = db.query(model_informacion_contratista.InformacionContratista).filter(model_informacion_contratista.InformacionContratista.id == informacion_contratista_id).first()
    if db_informacion_contratista is None:
        raise HTTPException(status_code=404, detail="Información de contratista no encontrada")
    
    db.delete(db_informacion_contratista)
    db.commit()
    return db_informacion_contratista
