from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import responsable as model_responsable
from ..schema import responsable as schema_responsable
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_responsable.Responsable)
def create_responsable(responsable: schema_responsable.ResponsableCreate, db: Session = Depends(get_db)):
    db_responsable = model_responsable.Responsable(**responsable.dict())
    db.add(db_responsable)
    db.commit()
    db.refresh(db_responsable)
    return db_responsable

@router.get("/", response_model=List[schema_responsable.Responsable])
def read_responsables(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    responsables = db.query(model_responsable.Responsable).offset(skip).limit(limit).all()
    return responsables

@router.get("/{responsable_id}", response_model=schema_responsable.Responsable)
def read_responsable(responsable_id: int, db: Session = Depends(get_db)):
    db_responsable = db.query(model_responsable.Responsable).filter(model_responsable.Responsable.id == responsable_id).first()
    if db_responsable is None:
        raise HTTPException(status_code=404, detail="Responsable no encontrado")
    return db_responsable

@router.put("/{responsable_id}", response_model=schema_responsable.Responsable)
def update_responsable(responsable_id: int, responsable: schema_responsable.ResponsableUpdate, db: Session = Depends(get_db)):
    db_responsable = db.query(model_responsable.Responsable).filter(model_responsable.Responsable.id == responsable_id).first()
    if db_responsable is None:
        raise HTTPException(status_code=404, detail="Responsable no encontrado")
    
    for key, value in responsable.dict(exclude_unset=True).items():
        setattr(db_responsable, key, value)
    
    db.commit()
    db.refresh(db_responsable)
    return db_responsable

@router.delete("/{responsable_id}", response_model=schema_responsable.Responsable)
def delete_responsable(responsable_id: int, db: Session = Depends(get_db)):
    db_responsable = db.query(model_responsable.Responsable).filter(model_responsable.Responsable.id == responsable_id).first()
    if db_responsable is None:
        raise HTTPException(status_code=404, detail="Responsable no encontrado")
    
    db.delete(db_responsable)
    db.commit()
    return db_responsable
