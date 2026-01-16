from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.model.categoria_documento import CategoriaDocumento
from app.schema.categoria_documento import (
    CategoriaDocumentoResponse,
    CategoriaDocumentoCreate,
    CategoriaDocumentoUpdate
)


router = APIRouter()


@router.get("/", response_model=List[CategoriaDocumentoResponse])
async def get_categorias(
    estado: bool = True,
    db: Session = Depends(get_db)
):
    """Obtener todas las categorías de documentos activas"""
    try:
        categorias = db.query(CategoriaDocumento).filter(
            CategoriaDocumento.estado == estado
        ).all()
        return categorias
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id_categoria}", response_model=CategoriaDocumentoResponse)
async def get_categoria(
    id_categoria: int,
    db: Session = Depends(get_db)
):
    """Obtener una categoría por ID"""
    categoria = db.query(CategoriaDocumento).filter(
        CategoriaDocumento.id_categoria == id_categoria
    ).first()
    
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    return categoria


@router.post("/", response_model=CategoriaDocumentoResponse, status_code=201)
async def create_categoria(
    categoria: CategoriaDocumentoCreate,
    db: Session = Depends(get_db)
):
    """Crear nueva categoría"""
    try:
        nueva_categoria = CategoriaDocumento(**categoria.dict())
        db.add(nueva_categoria)
        db.commit()
        db.refresh(nueva_categoria)
        return nueva_categoria
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id_categoria}", response_model=CategoriaDocumentoResponse)
async def update_categoria(
    id_categoria: int,
    categoria: CategoriaDocumentoUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar categoría existente"""
    db_categoria = db.query(CategoriaDocumento).filter(
        CategoriaDocumento.id_categoria == id_categoria
    ).first()
    
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    try:
        for key, value in categoria.dict(exclude_unset=True).items():
            setattr(db_categoria, key, value)
        
        db.commit()
        db.refresh(db_categoria)
        return db_categoria
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id_categoria}", status_code=204)
async def delete_categoria(
    id_categoria: int,
    db: Session = Depends(get_db)
):
    """Eliminar (desactivar) categoría"""
    db_categoria = db.query(CategoriaDocumento).filter(
        CategoriaDocumento.id_categoria == id_categoria
    ).first()
    
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    try:
        db_categoria.estado = False
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
