from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.model.tipo_obra import TipoObra
from app.schema.tipo_obra import TipoObra as TipoObraSchema
from app.core.database import get_async_db
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[TipoObraSchema])
async def get_tipos_obra(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(TipoObra))
    return result.scalars().all()

@router.get("/{tipo_id}", response_model=TipoObraSchema)
async def get_tipo_obra(tipo_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(TipoObra).where(TipoObra.id == tipo_id))
    tipo = result.scalars().first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo de obra no encontrado")
    return tipo