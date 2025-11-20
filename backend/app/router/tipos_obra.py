from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.model.tipo_obra import TipoObra
from app.schema.tipo_obra import TipoObra as TipoObraSchema
from app.core.database import get_db

router = APIRouter(prefix="/tipos-obra", tags=["Tipos de Obra"])

@router.get("/", response_model=List[TipoObraSchema])
def get_tipos_obra(db: Session = Depends(get_db)):
    return db.query(TipoObra).all()

@router.get("/{tipo_id}", response_model=TipoObraSchema)
def get_tipo_obra(tipo_id: int, db: Session = Depends(get_db)):
    tipo = db.query(TipoObra).filter(TipoObra.id == tipo_id).first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo de obra no encontrado")
    return tipo