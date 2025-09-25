from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from app.config.db import get_db
from app.model.roles import Role
from app.schema.role_schema import RoleSchema, RoleCreateSchema
from app.utils.response import custom_response

router = APIRouter(tags=["Role"])


@router.get('/', status_code=HTTP_200_OK, response_model=List[RoleSchema], tags=['Role'])
def get_roles(db: Session = Depends(get_db)):
    """Obtener todos los roles activos"""
    roles = db.query(Role).filter(Role.delete_date.is_(None)).all()
    return custom_response(
        HTTP_200_OK,
        "Roles obtenidos correctamente",
        True,
        jsonable_encoder(roles)
    )


@router.post('/', status_code=HTTP_201_CREATED, response_model=RoleSchema, tags=['Role'])
def create_roles(role_data: RoleCreateSchema, db: Session = Depends(get_db)):
    """Crear un nuevo rol"""
    # Verificar si el rol ya existe
    existing_role = db.query(Role).filter(Role.name == role_data.name).first()
    if existing_role:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un rol con este nombre"
        )
    
    # Crear el nuevo rol
    new_role = Role(**role_data.dict())
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    
    return custom_response(
        HTTP_201_CREATED, 
        "Rol creado correctamente", 
        True, 
        jsonable_encoder(new_role)
    )

@router.get('/{role_id}', status_code=HTTP_200_OK, response_model=RoleSchema, tags=['Role'])
def get_role(role_id: int, db: Session = Depends(get_db)):
    """Obtener un rol por su ID"""
    role = db.query(Role).filter(
        Role.id_role == role_id,
        Role.delete_date.is_(None)
    ).first()
    
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

@router.put('/{role_id}', status_code=HTTP_200_OK, response_model=RoleSchema, tags=['Role'])
def update_role(
    role_id: int, 
    role_data: RoleCreateSchema, 
    db: Session = Depends(get_db)
):
    """Actualizar un rol existente"""
    # Buscar el rol
    role = db.query(Role).filter(
        Role.id_role == role_id,
        Role.delete_date.is_(None)
    ).first()
    
    if not role:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Rol no encontrado"
        )
    
    # Verificar si el nuevo nombre ya existe (si se está actualizando el nombre)
    if role_data.name != role.name:
        existing_role = db.query(Role).filter(
            Role.name == role_data.name,
            Role.id_role != role_id
        ).first()
        if existing_role:
            raise HTTPException(
                status_code=400,
                detail="Ya existe otro rol con este nombre"
            )
    
    # Actualizar los campos
    for key, value in role_data.dict(exclude_unset=True).items():
        setattr(role, key, value)
    
    db.commit()
    db.refresh(role)
    
    return custom_response(
        HTTP_200_OK, 
        "Rol actualizado correctamente", 
        True, 
        jsonable_encoder(role)
    )

@router.delete('/{role_id}', status_code=HTTP_200_OK, tags=['Role'])
def delete_role(role_id: int, db: Session = Depends(get_db)):
    """Eliminar un rol (borrado lógico)"""
    role = db.query(Role).filter(
        Role.id_role == role_id,
        Role.delete_date.is_(None)
    ).first()
    
    if not role:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Rol no encontrado"
        )
    
    # Realizar borrado lógico
    role.delete_date = datetime.now()
    db.commit()
    
    return custom_response(
        HTTP_200_OK, 
        "Rol eliminado correctamente", 
        True
    )
