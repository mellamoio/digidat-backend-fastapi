from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config.db import get_async_db
from app.model.informacion_contratista import InformacionContratista
from app.schema.informacion_contratista import (
    InformacionContratistaCreate,
    InformacionContratistaUpdate,
    InformacionContratistaResponse
)

from app.utils.response import custom_response
from app.utils.auth import get_current_user


router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get("/")
async def listar(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(InformacionContratista))
    infos = result.scalars().all()

    data = [
        InformacionContratistaResponse.from_orm(info).dict()
        for info in infos
    ]

    return custom_response(
        code=status.HTTP_200_OK,
        message="Listado de Información de contratistas",
        data=data
    )


@router.get("/{info_id}")
async def obtener(info_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(InformacionContratista).where(InformacionContratista.id == info_id))
    info = result.scalars().first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de contratista no encontrada",
            response_code=False
        )

    data = InformacionContratistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de contratista encontrada",
        data=data
    )

@router.post("/")
async def crear(data: InformacionContratistaCreate, db: AsyncSession = Depends(get_async_db)):
    info = InformacionContratista(**data.dict())
    db.add(info)
    await db.commit()
    await db.refresh(info)

    response_data = InformacionContratistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_201_CREATED,
        message="Información de contratista creada correctamente",
        data=response_data
    )


@router.put("/{info_id}")
async def actualizar(
    info_id: int,
    data: InformacionContratistaUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(InformacionContratista).where(InformacionContratista.id == info_id))
    info = result.scalars().first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de contratista no encontrada",
            response_code=False
        )

    for field, value in data.dict(exclude_unset=True).items():
        setattr(info, field, value)

    await db.commit()
    await db.refresh(info)

    response_data = InformacionContratistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de contratista actualizada correctamente",
        data=response_data
    )


@router.delete("/{info_id}")
async def eliminar(info_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(InformacionContratista).where(InformacionContratista.id == info_id))
    info = result.scalars().first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de contratista no encontrada",
            response_code=False
        )

    await db.delete(info)
    await db.commit()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de contratista eliminada correctamente",
        data=None
    )
