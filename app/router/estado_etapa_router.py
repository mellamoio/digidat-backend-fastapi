from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.config.db import get_async_db
from app.schema.estado_etapa import EstadoEtapaResponse, EstadoEtapaCreate
from app.model.estado_etapa import EstadoEtapa
from app.utils.auth import get_current_user


router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("/", response_model=List[EstadoEtapaResponse])
async def get_estados_etapa(db: AsyncSession = Depends(get_async_db)):
    """
    Obtener todos los estados de etapa ordenados por su secuencia
    """
    result = await db.execute(select(EstadoEtapa).order_by(EstadoEtapa.orden))
    estados = result.scalars().all()
    return estados


@router.get("/{estado_id}", response_model=EstadoEtapaResponse)
async def get_estado_etapa(estado_id: int, db: AsyncSession = Depends(get_async_db)):
    """
    Obtener un estado de etapa específico por ID
    """
    result = await db.execute(select(EstadoEtapa).where(EstadoEtapa.id == estado_id))
    estado = result.scalars().first()
    if not estado:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    return estado


@router.post("/", response_model=EstadoEtapaResponse)
async def create_estado_etapa(estado: EstadoEtapaCreate, db: AsyncSession = Depends(get_async_db)):
    """
    Crear un nuevo estado de etapa
    """
    nuevo_estado = EstadoEtapa(**estado.dict())
    db.add(nuevo_estado)
    await db.commit()
    await db.refresh(nuevo_estado)
    return nuevo_estado


@router.delete("/{estado_id}")
async def delete_estado_etapa(estado_id: int, db: AsyncSession = Depends(get_async_db)):
    """
    Eliminar un estado de etapa (también elimina sus actividades asociadas)
    """
    result = await db.execute(select(EstadoEtapa).where(EstadoEtapa.id == estado_id))
    estado = result.scalars().first()
    if not estado:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    
    await db.delete(estado)
    await db.commit()
    return {"message": f"Estado '{estado.nombre}' y sus actividades eliminados correctamente"}