from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..model import beneficiario as model_beneficiario
from ..schema import beneficiario as schema_beneficiario
from ..config.db import get_async_db
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

@router.post("/", response_model=schema_beneficiario.Beneficiario)
async def create_beneficiario(beneficiario: schema_beneficiario.BeneficiarioCreate, db: AsyncSession = Depends(get_async_db)):
    db_beneficiario = model_beneficiario.Beneficiario(**beneficiario.dict())
    db.add(db_beneficiario)
    await db.commit()
    await db.refresh(db_beneficiario)
    return db_beneficiario

@router.get("/", response_model=List[schema_beneficiario.Beneficiario])
async def read_beneficiarios(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(model_beneficiario.Beneficiario).offset(skip).limit(limit))
    beneficiarios = result.scalars().all()
    return beneficiarios

@router.get("/{beneficiario_id}", response_model=schema_beneficiario.Beneficiario)
async def read_beneficiario(beneficiario_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(model_beneficiario.Beneficiario).where(model_beneficiario.Beneficiario.id == beneficiario_id))
    db_beneficiario = result.scalars().first()
    if db_beneficiario is None:
        raise HTTPException(status_code=404, detail="Beneficiario no encontrado")
    return db_beneficiario

@router.put("/{beneficiario_id}", response_model=schema_beneficiario.Beneficiario)
async def update_beneficiario(beneficiario_id: int, beneficiario: schema_beneficiario.BeneficiarioUpdate, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(model_beneficiario.Beneficiario).where(model_beneficiario.Beneficiario.id == beneficiario_id))
    db_beneficiario = result.scalars().first()
    if db_beneficiario is None:
        raise HTTPException(status_code=404, detail="Beneficiario no encontrado")
    
    for key, value in beneficiario.dict(exclude_unset=True).items():
        setattr(db_beneficiario, key, value)
    
    await db.commit()
    await db.refresh(db_beneficiario)
    return db_beneficiario

@router.delete("/{beneficiario_id}", response_model=schema_beneficiario.Beneficiario)
async def delete_beneficiario(beneficiario_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(model_beneficiario.Beneficiario).where(model_beneficiario.Beneficiario.id == beneficiario_id))
    db_beneficiario = result.scalars().first()
    if db_beneficiario is None:
        raise HTTPException(status_code=404, detail="Beneficiario no encontrado")
    
    await db.delete(db_beneficiario)
    await db.commit()
    return db_beneficiario
