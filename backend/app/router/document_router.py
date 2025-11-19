from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Union

from app.config.db import get_db
from app.model.document import Documento
from app.schema.document_schema import DocumentoCreate, DocumentoResponse, DocumentoUpdate

router = APIRouter()

# Crear uno o varios documentos
@router.post("/", response_model=List[DocumentoResponse], status_code=status.HTTP_201_CREATED)
def create_documentos(
    documentos: Union[DocumentoCreate, List[DocumentoCreate]],
    db: Session = Depends(get_db),
):
    # Aceptamos un solo documento o lista
    if isinstance(documentos, list):
        new_docs = [Documento(**doc.dict()) for doc in documentos]
    else:
        new_docs = [Documento(**documentos.dict())]

    db.add_all(new_docs)
    db.commit()
    for doc in new_docs:
        db.refresh(doc)

    return new_docs


# Obtener todos los documentos no borrados
@router.get("/", response_model=List[DocumentoResponse])
def get_documentos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documentos = (
        db.query(Documento)
        .filter(Documento.delete_date.is_(None))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return documentos


# Obtener un documento por ID (si no está borrado)
@router.get("/{documento_id}", response_model=DocumentoResponse)
def get_documento(documento_id: int, db: Session = Depends(get_db)):
    documento = (
        db.query(Documento)
        .filter(Documento.id_documento == documento_id, Documento.delete_date.is_(None))
        .first()
    )
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento


# Actualizar documento (parcialmente)
@router.patch("/{documento_id}", response_model=DocumentoResponse)
def update_documento(documento_id: int, data_update: DocumentoUpdate, db: Session = Depends(get_db)):
    documento = db.query(Documento).filter(Documento.id_documento == documento_id, Documento.delete_date.is_(None)).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    update_data = data_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)
    return documento


# Soft delete (actualiza delete_date)
@router.delete("/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
def soft_delete_documento(documento_id: int, db: Session = Depends(get_db)):
    documento = db.query(Documento).filter(Documento.id_documento == documento_id, Documento.delete_date.is_(None)).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    documento.delete_date = datetime.utcnow()
    db.commit()
