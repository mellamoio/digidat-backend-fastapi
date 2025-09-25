from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import informacion_financista as model_informacion_financista
from ..schema import informacion_financista as schema_informacion_financista
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_informacion_financista.InformacionFinancista)
def create_informacion_financista(informacion_financista: schema_informacion_financista.InformacionFinancistaCreate, db: Session = Depends(get_db)):
    db_informacion_financista = model_informacion_financista.InformacionFinancista(**informacion_financista.dict())
    db.add(db_informacion_financista)
    db.commit()
    db.refresh(db_informacion_financista)
    return db_informacion_financista

@router.get("/", response_model=List[schema_informacion_financista.InformacionFinancista])
def read_informaciones_financista(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    informaciones_financista = db.query(model_informacion_financista.InformacionFinancista).offset(skip).limit(limit).all()
    return informaciones_financista

@router.get("/{informacion_financista_id}", response_model=schema_informacion_financista.InformacionFinancista)
def read_informacion_financista(informacion_financista_id: int, db: Session = Depends(get_db)):
    db_informacion_financista = db.query(model_informacion_financista.InformacionFinancista).filter(model_informacion_financista.InformacionFinancista.id == informacion_financista_id).first()
    if db_informacion_financista is None:
        raise HTTPException(status_code=404, detail="Información de financista no encontrada")
    return db_informacion_financista

@router.put("/{informacion_financista_id}", response_model=schema_informacion_financista.InformacionFinancista)
def update_informacion_financista(informacion_financista_id: int, informacion_financista: schema_informacion_financista.InformacionFinancistaUpdate, db: Session = Depends(get_db)):
    db_informacion_financista = db.query(model_informacion_financista.InformacionFinancista).filter(model_informacion_financista.InformacionFinancista.id == informacion_financista_id).first()
    if db_informacion_financista is None:
        raise HTTPException(status_code=404, detail="Información de financista no encontrada")
    
    for key, value in informacion_financista.dict(exclude_unset=True).items():
        setattr(db_informacion_financista, key, value)
    
    db.commit()
    db.refresh(db_informacion_financista)
    return db_informacion_financista

@router.delete("/{informacion_financista_id}", response_model=schema_informacion_financista.InformacionFinancista)
def delete_informacion_financista(informacion_financista_id: int, db: Session = Depends(get_db)):
    db_informacion_financista = db.query(model_informacion_financista.InformacionFinancista).filter(model_informacion_financista.InformacionFinancista.id == informacion_financista_id).first()
    if db_informacion_financista is None:
        raise HTTPException(status_code=404, detail="Información de financista no encontrada")
    
    db.delete(db_informacion_financista)
    db.commit()
    return db_informacion_financista
