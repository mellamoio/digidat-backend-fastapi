from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import obra as model_obra
from ..schema import obra as schema_obra
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_obra.Obra)
def create_obra(obra: schema_obra.ObraCreate, db: Session = Depends(get_db)):
    db_obra = model_obra.Obra(**obra.dict())
    db.add(db_obra)
    db.commit()
    db.refresh(db_obra)
    return db_obra

@router.get("/", response_model=List[schema_obra.Obra])
def read_obras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    obras = db.query(model_obra.Obra).offset(skip).limit(limit).all()
    return obras

@router.get("/{obra_id}", response_model=schema_obra.Obra)
def read_obra(obra_id: int, db: Session = Depends(get_db)):
    db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
    raise HTTPException(status_code=404, detail="Obra no encontrada")
    return db_obra

@router.put("/{obra_id}", response_model=schema_obra.Obra)
def update_obra(obra_id: int, obra: schema_obra.ObraUpdate, db: Session = Depends(get_db)):
    db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
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
    db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    db.delete(db_obra)
    db.commit()
    return {"ok": True}