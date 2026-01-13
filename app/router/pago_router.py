from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.config.db import get_async_db
from app.model.pago import Pago
from app.schema.pago_shcema import PagoCreate, PagoUpdate, PagoResponse
from app.utils.auth import get_current_user


router = APIRouter(dependencies=[Depends(get_current_user)])

@router.post(
    "",
    response_model=PagoResponse,
    status_code=status.HTTP_201_CREATED
)
async def crear_pago(
    pago_data: PagoCreate,
    db: AsyncSession = Depends(get_async_db)
):
    nuevo_pago = Pago(
        id_obra=pago_data.id_obra,
        id_beneficiario=pago_data.id_beneficiario,
        id_tipo_gasto=pago_data.id_tipo_gasto,
        id_estado_reembolso=pago_data.id_estado_reembolso,
        id_responsable=pago_data.id_responsable,
        concepto_pago=pago_data.concepto_pago,
        monto_pagado=pago_data.monto_pagado,
        fecha_pago=pago_data.fecha_pago,
        deleted_at=None
    )

    db.add(nuevo_pago)

    await db.flush()
    await db.refresh(nuevo_pago)

    return nuevo_pago


@router.put("/{id_pago}", response_model=PagoResponse)
async def editar_pago(
    id_pago: int,
    pago_data: PagoUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    stmt = select(Pago).where(
        Pago.id_pago == id_pago,
        Pago.deleted_at.is_(None)
    )

    result = await db.execute(stmt)
    pago = result.scalar_one_or_none()

    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")

    for field, value in pago_data.dict(exclude_unset=True).items():
        setattr(pago, field, value)

    await db.flush()
    await db.refresh(pago)

    return pago

@router.delete("/{id_pago}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_pago(
    id_pago: int,
    db: AsyncSession = Depends(get_async_db)
):
    stmt = select(Pago).where(
        Pago.id_pago == id_pago,
        Pago.deleted_at.is_(None)
    )

    result = await db.execute(stmt)
    pago = result.scalar_one_or_none()

    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")

    pago.deleted_at = datetime.utcnow()

    await db.flush()