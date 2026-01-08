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
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])


@router.get('/', status_code=HTTP_200_OK, response_model=List[RoleSchema])
def get_roles(db: Session = Depends(get_db)):
    """Obtener todos los roles activos"""
    roles = db.query(Role).filter(Role.delete_date.is_(None)).all()
    return custom_response(
        HTTP_200_OK,
        "Roles obtenidos correctamente",
        True,
        jsonable_encoder(roles)
    )


@router.post('/', status_code=HTTP_201_CREATED, response_model=RoleSchema)
def create_roles(role_data: RoleCreateSchema, db: Session = Depends(get_db)):
    """Crear un nuevo rol"""
    existing_role = db.query(Role).filter(Role.name == role_data.name).first()
    if existing_role:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un rol con este nombre"
        )
    
    new_role = Role(**role_data.model_dump())
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    
    return custom_response(
        HTTP_201_CREATED, 
        "Rol creado correctamente", 
        True, 
        jsonable_encoder(new_role)
    )

@router.get('/{role_id}', status_code=HTTP_200_OK, response_model=RoleSchema)
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

@router.put('/{role_id}', status_code=HTTP_200_OK, response_model=RoleSchema)
def update_role(
    role_id: int, 
    role_data: RoleCreateSchema, 
    db: Session = Depends(get_db)
):
    """Actualizar un rol existente"""
    role = db.query(Role).filter(
        Role.id_role == role_id,
        Role.delete_date.is_(None)
    ).first()
    
    if not role:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Rol no encontrado"
        )
    
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

@router.delete('/{role_id}', status_code=HTTP_200_OK)
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
    
    role.delete_date = datetime.now()
    db.commit()
    
    return custom_response(
        HTTP_200_OK, 
        "Rol eliminado correctamente", 
        True
    )
