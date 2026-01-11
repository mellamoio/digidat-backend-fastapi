from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from app.config.db import get_async_db
from app.model.roles import Role
from app.schema.role_schema import RoleSchema, RoleCreateSchema
from app.utils.response import custom_response
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get('/', status_code=HTTP_200_OK, response_model=List[RoleSchema])
async def get_roles(db: AsyncSession = Depends(get_async_db)):
    """Obtener todos los roles activos"""
    result = await db.execute(select(Role).where(Role.delete_date.is_(None)))
    roles = result.scalars().all()
    return custom_response(
        HTTP_200_OK,
        "Roles obtenidos correctamente",
        True,
        jsonable_encoder(roles)
    )


@router.post('/', status_code=HTTP_201_CREATED, response_model=RoleSchema)
async def create_roles(role_data: RoleCreateSchema, db: AsyncSession = Depends(get_async_db)):
    """Crear un nuevo rol"""
    result = await db.execute(select(Role).where(Role.name == role_data.name))
    existing_role = result.scalars().first()
    if existing_role:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un rol con este nombre"
        )
    
    new_role = Role(**role_data.model_dump())
    db.add(new_role)
    await db.commit()
    await db.refresh(new_role)
    
    return custom_response(
        HTTP_201_CREATED, 
        "Rol creado correctamente", 
        True, 
        jsonable_encoder(new_role)
    )

@router.get('/{role_id}', status_code=HTTP_200_OK, response_model=RoleSchema)
async def get_role(role_id: int, db: AsyncSession = Depends(get_async_db)):
    """Obtener un rol por su ID"""
    result = await db.execute(select(Role).where(
        Role.id_role == role_id,
        Role.delete_date.is_(None)
    ))
    role = result.scalars().first()
    
    if not role:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Rol no encontrado"
        )
    
    return custom_response(
        HTTP_200_OK, 
        "Rol obtenido correctamente", 
        True, 
        jsonable_encoder(role)
    )

@router.put('/{role_id}', status_code=HTTP_200_OK, response_model=RoleSchema)
async def update_role(
    role_id: int, 
    role_data: RoleCreateSchema, 
    db: AsyncSession = Depends(get_async_db)
):
    """Actualizar un rol existente"""
    result = await db.execute(select(Role).where(
        Role.id_role == role_id,
        Role.delete_date.is_(None)
    ))
    role = result.scalars().first()
    
    if not role:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Rol no encontrado"
        )
    
    if role_data.name != role.name:
        result = await db.execute(select(Role).where(
            Role.name == role_data.name,
            Role.id_role != role_id
        ))
        existing_role = result.scalars().first()
        if existing_role:
            raise HTTPException(
                status_code=400,
                detail="Ya existe otro rol con este nombre"
            )
    
    for key, value in role_data.dict(exclude_unset=True).items():
        setattr(role, key, value)
    
    await db.commit()
    await db.refresh(role)
    
    return custom_response(
        HTTP_200_OK, 
        "Rol actualizado correctamente", 
        True, 
        jsonable_encoder(role)
    )

@router.delete('/{role_id}', status_code=HTTP_200_OK)
async def delete_role(role_id: int, db: AsyncSession = Depends(get_async_db)):
    """Eliminar un rol (borrado lógico)"""
    result = await db.execute(select(Role).where(
        Role.id_role == role_id,
        Role.delete_date.is_(None)
    ))
    role = result.scalars().first()
    
    if not role:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Rol no encontrado"
        )
    
    role.delete_date = datetime.now()
    await db.commit()
    
    return custom_response(
        HTTP_200_OK, 
        "Rol eliminado correctamente", 
        True
    )
