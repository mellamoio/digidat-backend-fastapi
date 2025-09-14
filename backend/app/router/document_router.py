from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.config.db import SessionLocal
from app.model.document import Document as DocumentModel
from app.schema.document_schema import Document as DocumentSchema, DocumentCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear documento
@router.post("/", response_model=DocumentSchema, status_code=status.HTTP_201_CREATED)
def create_document(document: DocumentCreate, db: Session = Depends(get_db)):
    db_document = DocumentModel(**document.model_dump())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

# Listar documentos
@router.get("/", response_model=List[DocumentSchema], status_code=status.HTTP_200_OK)
def read_documents(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(DocumentModel).offset(skip).limit(limit).all()

# Consultar por ID
@router.get("/{document_id}", response_model=DocumentSchema, status_code=status.HTTP_200_OK)
def read_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(DocumentModel).filter(DocumentModel.id_document == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return document

# Obtener todos los documentos asociados a un proyecto específico
@router.get("/by_project/{project_id}", response_model=List[DocumentSchema], status_code=status.HTTP_200_OK)
def get_documents_by_project(project_id: int, db: Session = Depends(get_db)):
    documents = db.query(DocumentModel).filter(DocumentModel.id_project == project_id).all()
    return documents


# Actualizar documento
@router.put("/{document_id}", response_model=DocumentSchema, status_code=status.HTTP_200_OK)
def update_document(document_id: int, document: DocumentCreate, db: Session = Depends(get_db)):
    db_document = db.query(DocumentModel).filter(DocumentModel.id_document == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    for key, value in document.model_dump().items():
        setattr(db_document, key, value)
    db.commit()
    db.refresh(db_document)
    return db_document

# Eliminar documento
@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
def delete_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(DocumentModel).filter(DocumentModel.id_document == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    db.delete(db_document)
    db.commit()
    return Response(content='{"detail": "Documento eliminado"}', media_type="application/json")