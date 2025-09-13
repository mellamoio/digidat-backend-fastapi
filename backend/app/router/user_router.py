from fastapi import APIRouter, Response, HTTPException
from fastapi.encoders import jsonable_encoder
from starlette.status import HTTP_201_CREATED, HTTP_200_OK
from schema.user_schema import UserSchema, UserCreateSchema, UserEditSchema
from config.db import engine
from model.users import users
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from typing import List
from utils.response import custom_response


router = APIRouter(tags=["User"])


@router.get('/api/v1/user', status_code=HTTP_200_OK, response_model=List[UserSchema], tags=['User'])
def get_users():
    with engine.begin() as conn:
        result = conn.execute(users.select().where(users.c.delete_date.is_(None))).fetchall()
        users_list = [dict(row._mapping) for row in result]
        return custom_response(HTTP_200_OK, "Usuarios obtenidos correctamente", True, jsonable_encoder(users_list))

@router.post('/api/v1/user', status_code=HTTP_201_CREATED, tags=['User'])
def create_user(data_user: UserCreateSchema):
    new_user = data_user.dict()
    new_user['password_hash'] = generate_password_hash(data_user.password_hash, "pbkdf2:sha256:30",30)

    with engine.begin() as conn:
        conn.execute(users.insert().values(new_user))
    return custom_response(HTTP_201_CREATED, "Usuario creado correctamente", True)


@router.get('/api/v1/user/{id}', status_code=HTTP_200_OK, response_model=UserSchema, tags=['User'])
def get_user(id:int):
    with engine.begin() as conn:
        result = conn.execute(users.select().where(users.c.id_user == id)).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return custom_response(HTTP_200_OK, "Usuario encontrado", True, jsonable_encoder(dict(result._mapping)))

@router.put('/api/v1/user/{id}',status_code=HTTP_200_OK, response_model=UserEditSchema, tags=['User'])
def update_user(id:int, data_update:UserEditSchema):
    with engine.begin() as conn:
        encryp_passw = generate_password_hash(data_update.password_hash, "pbkdf2:sha256:30",30)
        conn.execute(users.update().values(
            name = data_update.name,
            email = data_update.email,
            password_hash = encryp_passw,
            status = data_update.status,
            url_photo = data_update.url_photo,
            id_role = data_update.id_role
        ).where(users.c.id_user == id))
        result = conn.execute(users.select().where(users.c.id_user == id)).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return custom_response(HTTP_200_OK, "Usuario actualizado", True, jsonable_encoder(dict(result._mapping)))

@router.delete('/api/v1/user/{id}', response_model=UserSchema, status_code=HTTP_200_OK, tags=['User'])
def soft_delete_user(id:int):
    with engine.begin() as conn:
        conn.execute(users.update().values(
            delete_date = datetime.now()
        ).where(users.c.id_user == id))
        result = conn.execute(users.select().where(users.c.id_user == id)).first()

    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return custom_response(HTTP_200_OK, "Usuario eliminado correctamente", True)