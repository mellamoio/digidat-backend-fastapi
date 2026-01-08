from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Union, Optional
import uuid

from app.config.db import get_db
from app.model.document import Documento
from app.schema.document_schema import (
    DocumentoCreate,
    DocumentoResponse,
    DocumentoUpdate,
)
from app.utils.s3_services import upload_file_to_s3

router = APIRouter()


# =========================================================
# SUBIR DOCUMENTO A S3 (documents/)
# =========================================================
@router.post(
    "/upload",
    response_model=DocumentoResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_documento(
    file: UploadFile = File(...),

    uploaded_by: Optional[int] = Form(None),
    id_obra: Optional[int] = Form(None),
    id_etapa: Optional[int] = Form(None),
    id_informacion_financista: Optional[int] = Form(None),
    id_informacion_contratista: Optional[int] = Form(None),
    id_pago: Optional[int] = Form(None),

    db: Session = Depends(get_db),
):
    try:
        # 📁 Carpeta S3
        folder = "documents"
        key = f"{folder}/{uuid.uuid4()}_{file.filename}"

        # 📥 Leer archivo (una sola vez)
        file_bytes = file.file.read()
        size = len(file_bytes)

        # ☁️ Subir a S3 usando bytes
        upload_file_to_s3(
            file_bytes=file_bytes,
            key=key,
            content_type=file.content_type,
        )

        # 🗄️ Guardar en DB
        documento = Documento(
            nombre=file.filename,
            ruta=key,
            mime_type=file.content_type,
            tamano_bytes=size,
            uploaded_by=uploaded_by,
            id_obra=id_obra,
            id_etapa=id_etapa,
            id_informacionfinancista=id_informacion_financista,
            id_informacioncontratista=id_informacion_contratista,
            id_pago=id_pago,
        )

        db.add(documento)
        db.commit()
        db.refresh(documento)

        return documento

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error subiendo documento: {str(e)}",
        )

# =========================================================
# CREAR DOCUMENTOS (SIN ARCHIVO)
# =========================================================
@router.post(
    "/",
    response_model=List[DocumentoResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_documentos(
    documentos: Union[DocumentoCreate, List[DocumentoCreate]],
    db: Session = Depends(get_db),
):
    if not isinstance(documentos, list):
        documentos = [documentos]

    new_docs = []
    for doc in documentos:
        data = doc.dict()

        new_docs.append(
            Documento(
                nombre=data["nombre"],
                ruta=data["ruta"],
                mime_type=data.get("mime_type"),
                tamano_bytes=data.get("tamano_bytes"),
                uploaded_by=data.get("uploaded_by"),
                id_obra=data.get("id_obra"),
                id_etapa=data.get("id_etapa"),
                id_informacionfinancista=data.get("id_informacion_financista"),
                id_informacioncontratista=data.get("id_informacion_contratista"),
                id_pago=data.get("id_pago"),
            )
        )

    db.add_all(new_docs)
    db.commit()

    for doc in new_docs:
        db.refresh(doc)

    return new_docs

# =========================================================
# LISTAR DOCUMENTOS
# =========================================================
@router.get("/", response_model=List[DocumentoResponse])
def get_documentos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    documentos = (
        db.query(Documento)
        .filter(Documento.delete_date.is_(None))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return documentos

# =========================================================
# OBTENER DOCUMENTO POR ID
# =========================================================
@router.get("/{documento_id}", response_model=DocumentoResponse)
def get_documento(
    documento_id: int,
    db: Session = Depends(get_db),
):
    documento = (
        db.query(Documento)
        .filter(
            Documento.id_documento == documento_id,
            Documento.delete_date.is_(None),
        )
        .first()
    )

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado",
        )

    return documento

# =========================================================
# ACTUALIZAR DOCUMENTO
# =========================================================
@router.patch(
    "/{documento_id}",
    response_model=DocumentoResponse,
)
def update_documento(
    documento_id: int,
    data_update: DocumentoUpdate,
    db: Session = Depends(get_db),
):
    documento = (
        db.query(Documento)
        .filter(
            Documento.id_documento == documento_id,
            Documento.delete_date.is_(None),
        )
        .first()
    )

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado",
        )

    update_data = data_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)

    return documento

# =========================================================
# SOFT DELETE DOCUMENTO
# =========================================================
@router.delete(
    "/{documento_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def soft_delete_documento(
    documento_id: int,
    db: Session = Depends(get_db),
):
    documento = (
        db.query(Documento)
        .filter(
            Documento.id_documento == documento_id,
            Documento.delete_date.is_(None),
        )
        .first()
    )

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado",
        )

    documento.delete_date = datetime.utcnow()
    db.commit()
