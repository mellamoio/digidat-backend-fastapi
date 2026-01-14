from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
from botocore.exceptions import ClientError
import logging

from app.core.database import get_db
from app.services.aws import get_s3_client, get_bucket_name, is_s3_available
from app.model.document import Documento
from app.schema.document_schema import DocumentoCreate, DocumentoResponse, DocumentoUpdate

router = APIRouter()
logger = logging.getLogger(__name__)

# Tamaño máximo de archivo: 100MB
MAX_FILE_SIZE = 100 * 1024 * 1024


def upload_to_s3(file: UploadFile, folder: str) -> str:
    """Sube archivo a S3 y retorna la key"""
    if not is_s3_available():
        raise HTTPException(
            status_code=503,
            detail="Servicio S3 no disponible"
        )
    
    s3_client = get_s3_client()
    bucket_name = get_bucket_name()
    
    try:
        # Generar nombre único
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'bin'
        file_key = f"{folder}/{uuid4()}.{file_extension}"
        
        # Resetear el puntero del archivo
        file.file.seek(0)
        
        # Subir a S3
        s3_client.upload_fileobj(
            file.file,
            bucket_name,
            file_key,
            ExtraArgs={
                'ContentType': file.content_type or 'application/octet-stream',
                'Metadata': {
                    'original_filename': file.filename
                }
            }
        )
        
        logger.info(f"Archivo subido a S3: {file_key}")
        return file_key
        
    except ClientError as e:
        logger.error(f"Error al subir archivo a S3: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al subir archivo a S3: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error inesperado al subir archivo: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )
    finally:
        file.file.close()


def get_presigned_url(file_key: str, expiration: int = 3600) -> str:
    """Genera URL firmada temporal para acceder al archivo"""
    if not is_s3_available():
        raise HTTPException(
            status_code=503,
            detail="Servicio S3 no disponible"
        )
    
    s3_client = get_s3_client()
    bucket_name = get_bucket_name()
    
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': file_key},
            ExpiresIn=expiration
        )
        return url
    except ClientError as e:
        logger.error(f"Error al generar URL firmada: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar URL firmada: {str(e)}"
        )


def delete_from_s3(file_key: str) -> bool:
    """Elimina archivo de S3"""
    if not is_s3_available():
        logger.warning("S3 no disponible, no se puede eliminar archivo")
        return False
    
    s3_client = get_s3_client()
    bucket_name = get_bucket_name()
    
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=file_key)
        logger.info(f"Archivo eliminado de S3: {file_key}")
        return True
    except ClientError as e:
        logger.error(f"Error al eliminar archivo de S3: {e}")
        return False


@router.post("/upload", response_model=DocumentoResponse, status_code=status.HTTP_201_CREATED)
async def upload_documento(
    file: UploadFile = File(...),
    nombre: Optional[str] = Form(None),
    uploaded_by: Optional[int] = Form(None),
    id_obra: Optional[int] = Form(None),
    id_etapa: Optional[int] = Form(None),
    id_informacionfinancista: Optional[int] = Form(None),
    id_informacioncontratista: Optional[int] = Form(None),
    id_pago: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Sube un archivo a S3 y guarda la metadata en la base de datos.
    """
    
    # Validar tamaño del archivo
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Archivo muy grande. Maximo: 100MB, recibido: {file_size / 1024 / 1024:.2f}MB"
        )
    
    if file_size == 0:
        raise HTTPException(
            status_code=400,
            detail="El archivo esta vacio"
        )
    
    # Determinar carpeta según contexto
    folder = "general"
    if id_etapa:
        folder = f"etapas/{id_etapa}"
    elif id_informacionfinancista:
        folder = f"financistas/{id_informacionfinancista}"
    elif id_informacioncontratista:
        folder = f"contratistas/{id_informacioncontratista}"
    elif id_pago:
        folder = f"pagos/{id_pago}"
    elif id_obra:
        folder = f"obras/{id_obra}"
    
    # Subir a S3
    s3_key = upload_to_s3(file, folder)
    
    # Crear registro en BD
    documento_data = {
        "nombre": nombre or file.filename,
        "ruta": s3_key,
        "mime_type": file.content_type,
        "tamano_bytes": file_size,
        "uploaded_by": uploaded_by,
        "id_obra": id_obra,
        "id_etapa": id_etapa,
        "id_informacionfinancista": id_informacionfinancista,
        "id_informacioncontratista": id_informacioncontratista,
        "id_pago": id_pago,
    }
    
    try:
        new_documento = Documento(**documento_data)
        db.add(new_documento)
        db.commit()
        db.refresh(new_documento)
        
        logger.info(f"Documento creado en BD: ID {new_documento.id_documento}")
        return new_documento
        
    except Exception as e:
        # Si falla la BD, intentar eliminar de S3
        delete_from_s3(s3_key)
        logger.error(f"Error al guardar en BD: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al guardar documento: {str(e)}"
        )


@router.get("/", response_model=List[DocumentoResponse])
def get_documentos(
    skip: int = 0,
    limit: int = 100,
    id_obra: Optional[int] = Query(None),
    id_etapa: Optional[int] = Query(None),
    id_informacionfinancista: Optional[int] = Query(None),
    id_informacioncontratista: Optional[int] = Query(None),
    id_pago: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Lista documentos con filtros opcionales"""
    query = db.query(Documento).filter(Documento.delete_date.is_(None))
    
    if id_obra:
        query = query.filter(Documento.id_obra == id_obra)
    if id_etapa:
        query = query.filter(Documento.id_etapa == id_etapa)
    if id_informacionfinancista:
        query = query.filter(Documento.id_informacionfinancista == id_informacionfinancista)
    if id_informacioncontratista:
        query = query.filter(Documento.id_informacioncontratista == id_informacioncontratista)
    if id_pago:
        query = query.filter(Documento.id_pago == id_pago)
    
    documentos = query.offset(skip).limit(limit).all()
    return documentos


@router.get("/{documento_id}", response_model=DocumentoResponse)
def get_documento(documento_id: int, db: Session = Depends(get_db)):
    """Obtiene un documento específico por ID"""
    documento = db.query(Documento).filter(
        Documento.id_documento == documento_id,
        Documento.delete_date.is_(None)
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    return documento


@router.get("/{documento_id}/url")
def get_documento_url(
    documento_id: int,
    expiration: int = Query(3600, description="Tiempo de expiracion en segundos (max 7 dias)"),
    db: Session = Depends(get_db)
):
    """
    Genera una URL firmada temporal para descargar el archivo desde S3.
    """
    # Validar expiración (máximo 7 días = 604800 segundos)
    if expiration > 604800:
        expiration = 604800
    
    documento = db.query(Documento).filter(
        Documento.id_documento == documento_id,
        Documento.delete_date.is_(None)
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    # Generar URL firmada
    presigned_url = get_presigned_url(documento.ruta, expiration)
    
    return {
        "id_documento": documento.id_documento,
        "nombre": documento.nombre,
        "url": presigned_url,
        "expires_in": expiration
    }


@router.patch("/{documento_id}", response_model=DocumentoResponse)
def update_documento(
    documento_id: int,
    data_update: DocumentoUpdate,
    db: Session = Depends(get_db)
):
    """Actualiza la metadata del documento (no el archivo)"""
    documento = db.query(Documento).filter(
        Documento.id_documento == documento_id,
        Documento.delete_date.is_(None)
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    update_data = data_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)
    
    logger.info(f"Documento actualizado: ID {documento_id}")
    return documento


@router.delete("/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
def soft_delete_documento(documento_id: int, db: Session = Depends(get_db)):
    """Eliminación lógica (soft delete) del documento"""
    documento = db.query(Documento).filter(
        Documento.id_documento == documento_id,
        Documento.delete_date.is_(None)
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    documento.delete_date = datetime.utcnow()
    db.commit()
    
    logger.info(f"Documento eliminado (soft): ID {documento_id}")


@router.delete("/{documento_id}/hard", status_code=status.HTTP_204_NO_CONTENT)
async def hard_delete_documento(documento_id: int, db: Session = Depends(get_db)):
    """
    Eliminación física: elimina el archivo de S3 y el registro de la BD
    """
    documento = db.query(Documento).filter(
        Documento.id_documento == documento_id
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    # Eliminar de S3
    s3_deleted = delete_from_s3(documento.ruta)
    
    if not s3_deleted:
        logger.warning(f"No se pudo eliminar de S3: {documento.ruta}")
    
    # Eliminar de BD
    db.delete(documento)
    db.commit()
    
    logger.info(f"Documento eliminado (hard): ID {documento_id}")