from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import beneficiario as model_beneficiario
from ..schema import beneficiario as schema_beneficiario
from ..services.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_beneficiario.Beneficiario)
def create_beneficiario(beneficiario: schema_beneficiario.BeneficiarioCreate, db: Session = Depends(get_db)):
    db_beneficiario = model_beneficiario.Beneficiario(**beneficiario.dict())
    db.add(db_beneficiario)
    db.commit()
    db.refresh(db_beneficiario)
    return db_beneficiario

@router.get("/", response_model=List[schema_beneficiario.Beneficiario])
def read_beneficiarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    beneficiarios = db.query(model_beneficiario.Beneficiario).offset(skip).limit(limit).all()
    return beneficiarios

@router.get("/{beneficiario_id}", response_model=schema_beneficiario.Beneficiario)
def read_beneficiario(beneficiario_id: int, db: Session = Depends(get_db)):
    db_beneficiario = db.query(model_beneficiario.Beneficiario).filter(
        model_beneficiario.Beneficiario.id_beneficiario == beneficiario_id
    ).first()
    if db_beneficiario is None:
        raise HTTPException(status_code=404, detail="Beneficiario no encontrado")
    return db_beneficiario

@router.put("/{beneficiario_id}", response_model=schema_beneficiario.Beneficiario)
def update_beneficiario(beneficiario_id: int, beneficiario: schema_beneficiario.BeneficiarioUpdate, db: Session = Depends(get_db)):
    db_beneficiario = db.query(model_beneficiario.Beneficiario).filter(
        model_beneficiario.Beneficiario.id_beneficiario == beneficiario_id
    ).first()
    if db_beneficiario is None:
        raise HTTPException(status_code=404, detail="Beneficiario no encontrado")
    
    for key, value in beneficiario.dict(exclude_unset=True).items():
        setattr(db_beneficiario, key, value)
    
    db.commit()
    db.refresh(db_beneficiario)
    return db_beneficiario

@router.delete("/{beneficiario_id}", response_model=schema_beneficiario.Beneficiario)
def delete_beneficiario(beneficiario_id: int, db: Session = Depends(get_db)):
    db_beneficiario = db.query(model_beneficiario.Beneficiario).filter(
        model_beneficiario.Beneficiario.id_beneficiario == beneficiario_id
    ).first()
    if db_beneficiario is None:
        raise HTTPException(status_code=404, detail="Beneficiario no encontrado")
    
    db.delete(db_beneficiario)
    db.commit()
    return db_beneficiario
