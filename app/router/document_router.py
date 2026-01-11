from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import List, Union, Optional
import uuid
from starlette.concurrency import run_in_threadpool

from app.config.db import get_async_db
from app.model.document import Documento
from app.schema.document_schema import (
    DocumentoCreate,
    DocumentoResponse,
    DocumentoUpdate,
)
from app.utils.s3_services import upload_file_to_s3
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])


# =========================================================
# SUBIR DOCUMENTO A S3 (documents/)
# =========================================================
@router.post(
    "/upload",
    response_model=DocumentoResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_documento(
    file: UploadFile = File(...),

    uploaded_by: Optional[int] = Form(None),
    id_obra: Optional[int] = Form(None),
    id_etapa: Optional[int] = Form(None),
    id_informacion_financista: Optional[int] = Form(None),
    id_informacion_contratista: Optional[int] = Form(None),
    id_pago: Optional[int] = Form(None),

    db: AsyncSession = Depends(get_async_db),
):
    try:
        # 📁 Carpeta S3
        folder = "documents"
        key = f"{folder}/{uuid.uuid4()}_{file.filename}"

        # 📥 Leer archivo (una sola vez)
        file_bytes = await file.read()
        size = len(file_bytes)

        # ☁️ Subir a S3 usando bytes (evita bloquear el event loop)
        await run_in_threadpool(upload_file_to_s3, file_bytes=file_bytes, key=key, content_type=file.content_type)

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
        await db.commit()
        await db.refresh(documento)

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
async def create_documentos(
    documentos: Union[DocumentoCreate, List[DocumentoCreate]],
    db: AsyncSession = Depends(get_async_db),
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

    for doc in new_docs:
        db.add(doc)
    await db.commit()

    for doc in new_docs:
        await db.refresh(doc)

    return new_docs

# =========================================================
# LISTAR DOCUMENTOS
# =========================================================
@router.get("/", response_model=List[DocumentoResponse])
async def get_documentos(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_async_db),
):
    result = await db.execute(
        select(Documento).where(Documento.delete_date.is_(None)).offset(skip).limit(limit)
    )
    documentos = result.scalars().all()
    return documentos

# =========================================================
# OBTENER DOCUMENTO POR ID
# =========================================================
@router.get("/{documento_id}", response_model=DocumentoResponse)
async def get_documento(
    documento_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    result = await db.execute(
        select(Documento).where(
            Documento.id_documento == documento_id,
            Documento.delete_date.is_(None),
        )
    )
    documento = result.scalars().first()

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
async def update_documento(
    documento_id: int,
    data_update: DocumentoUpdate,
    db: AsyncSession = Depends(get_async_db),
):
    result = await db.execute(
        select(Documento).where(
            Documento.id_documento == documento_id,
            Documento.delete_date.is_(None),
        )
    )
    documento = result.scalars().first()

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado",
        )

    update_data = data_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(documento, key, value)

    await db.commit()
    await db.refresh(documento)

    return documento

# =========================================================
# SOFT DELETE DOCUMENTO
# =========================================================
@router.delete(
    "/{documento_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def soft_delete_documento(
    documento_id: int,
    db: AsyncSession = Depends(get_async_db),
):
    result = await db.execute(
        select(Documento).where(
            Documento.id_documento == documento_id,
            Documento.delete_date.is_(None),
        )
    )
    documento = result.scalars().first()

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado",
        )

    documento.delete_date = datetime.utcnow()
    await db.commit()