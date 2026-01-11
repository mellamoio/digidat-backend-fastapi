from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.config.db import get_async_db
from app.model.centro_operacion import CentroOperacion
from pydantic import BaseModel
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

class CentroOperacionResponse(BaseModel):
    id: int
    nombre: str
    
    class Config:
        from_attributes = True

class CentroOperacionCreate(BaseModel):
    nombre: str

@router.get("/", response_model=List[CentroOperacionResponse])
async def get_centros_operacion(db: AsyncSession = Depends(get_async_db)):
    """
    Obtener todos los centros de operación
    """
    result = await db.execute(select(CentroOperacion))
    centros = result.scalars().all()
    return centros

@router.post("/", response_model=CentroOperacionResponse, status_code=201)
async def create_centro_operacion(centro: CentroOperacionCreate, db: AsyncSession = Depends(get_async_db)):
    """
    Crear un nuevo centro de operación
    """
    new_centro = CentroOperacion(nombre=centro.nombre)
    db.add(new_centro)
    await db.commit()
    await db.refresh(new_centro)
    return new_centro

@router.delete("/{centro_id}")
async def delete_centro_operacion(centro_id: int, db: AsyncSession = Depends(get_async_db)):
    """
    Eliminar un centro de operación
    """
    result = await db.execute(select(CentroOperacion).where(CentroOperacion.id == centro_id))
    centro = result.scalars().first()
    if not centro:
        raise HTTPException(status_code=404, detail="Centro de operación no encontrado")
    
    await db.delete(centro)
    await db.commit()
    return {"message": "Centro de operación eliminado correctamente"}