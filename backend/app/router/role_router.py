from fastapi import APIRouter, Response, HTTPException
from fastapi.encoders import jsonable_encoder
from starlette.status import HTTP_201_CREATED, HTTP_200_OK
from app.schema.role_schema import RoleSchema, RoleCreateSchema
from app.config.db import engine
from app.model.roles import roles
from datetime import datetime
from typing import List
from app.utils.response import custom_response

router = APIRouter(tags=["Role"])

@router.get('/',status_code=HTTP_200_OK, response_model=List[RoleSchema], tags=['Role'])
def get_roles():
    with engine.begin() as conn:
        result = conn.execute(roles.select().where(roles.c.delete_date.is_(None))).fetchall()
        roles_list = [dict(row._mapping) for row in result]
    return custom_response(HTTP_200_OK, "Roles obtenidos correctamente", True, jsonable_encoder(roles_list))

@router.post('/', status_code=HTTP_201_CREATED, tags=['Role'])
def create_roles(data_role: RoleCreateSchema):
    new_role = data_role.dict()
    with engine.begin() as conn:
        conn.execute(roles.insert().values(new_role))
    return custom_response(HTTP_201_CREATED, "Rol creado correctamente", True)

@router.get('/{id}',status_code=HTTP_200_OK, response_model=RoleSchema, tags=['Role'])
def get_role(id:int):
    with engine.begin() as conn:
        result = conn.execute(roles.select().where(roles.c.id_role == id)).first()

    if not result:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    return custom_response(HTTP_200_OK, "Rol encontrado", True, jsonable_encoder(dict(result._mapping)))


@router.put('/{id}', status_code=HTTP_200_OK, response_model=RoleCreateSchema, tags=['Role'])
def update_role(id:int, data_update:RoleCreateSchema):
    with engine.begin() as conn:
        conn.execute(roles.update().values(
            name = data_update.name,
        ).where(roles.c.id_role == id))
        result = conn.execute(roles.select().where(roles.c.id_role == id)).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    return custom_response(HTTP_200_OK, "Rol actualizado", True, jsonable_encoder(dict(result._mapping)))

@router.delete('/{id}', response_model=RoleSchema, status_code=HTTP_200_OK, tags=['Role'])
def soft_delete_role(id:int):
    with engine.begin() as conn:
        conn.execute(roles.update().values(
            delete_date = datetime.now()
        ).where(roles.c.id_role == id))
        result = conn.execute(roles.select().where(roles.c.id_role == id)).first()

    if not result:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    return custom_response(HTTP_200_OK, "Rol eliminado correctamente", True)

