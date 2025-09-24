from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import model, schemas
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Obra)
def create_obra(obra: schemas.ObraCreate, db: Session = Depends(get_db)):
    db_obra = model.Obra(**obra.dict())
    db.add(db_obra)
    db.commit()
    db.refresh(db_obra)
    return db_obra

@router.get("/", response_model=List[schemas.Obra])
def read_obras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    obras = db.query(model.Obra).offset(skip).limit(limit).all()
    return obras

@router.get("/{obra_id}", response_model=schemas.Obra)
def read_obra(obra_id: int, db: Session = Depends(get_db)):
    db_obra = db.query(model.Obra).filter(model.Obra.id_obra == obra_id).first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    return db_obra

@router.put("/{obra_id}", response_model=schemas.Obra)
def update_obra(obra_id: int, obra: schemas.ObraUpdate, db: Session = Depends(get_db)):
    db_obra = db.query(model.Obra).filter(model.Obra.id_obra == obra_id).first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    update_data = obra.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obra, key, value)
    
    db.add(db_obra)
    db.commit()
    db.refresh(db_obra)
    return db_obra

@router.delete("/{obra_id}")
def delete_obra(obra_id: int, db: Session = Depends(get_db)):
    db_obra = db.query(model.Obra).filter(model.Obra.id_obra == obra_id).first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    db.delete(db_obra)
    db.commit()
    return {"ok": True}