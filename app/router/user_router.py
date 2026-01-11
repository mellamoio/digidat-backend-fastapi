from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from starlette.status import HTTP_201_CREATED, HTTP_200_OK
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from werkzeug.security import generate_password_hash
from typing import List

from app.schema.user_schema import UserSchema, UserCreateSchema, UserEditSchema
from app.model.users import User
from app.config.db import get_async_db
from app.utils.response import custom_response
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])
#router = APIRouter()

@router.get("/", status_code=HTTP_200_OK, response_model=List[UserSchema])
async def get_users(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(User))
    users_list = result.scalars().all()
    return custom_response(
        HTTP_200_OK,
        "Usuarios obtenidos correctamente",
        True,
        jsonable_encoder(users_list),
    )

@router.post("/", status_code=HTTP_201_CREATED)
async def create_user(data_user: UserCreateSchema, db: AsyncSession = Depends(get_async_db)):
    hashed_password = generate_password_hash(data_user.password, "pbkdf2:sha256:30", 30)
    new_user = User(
        nombre=data_user.nombre,
        correo=data_user.correo,
        contrasena_hash=hashed_password,
        estado=data_user.estado,
        id_role=data_user.id_role,
        cargo=data_user.cargo,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return custom_response(HTTP_201_CREATED, "Usuario creado correctamente", True, jsonable_encoder(new_user))

@router.get("/{id}", status_code=HTTP_200_OK, response_model=UserSchema)
async def get_user(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(User).where(User.id_responsable == id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return custom_response(HTTP_200_OK, "Usuario encontrado", True, jsonable_encoder(user))

@router.put("/{id}", status_code=HTTP_200_OK, response_model=UserEditSchema)
async def update_user(id: int, data_update: UserEditSchema, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(User).where(User.id_responsable == id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if data_update.password:
        user.contrasena_hash = generate_password_hash(data_update.password, "pbkdf2:sha256:30", 30)
    if data_update.nombre is not None:
        user.nombre = data_update.nombre
    if data_update.correo is not None:
        user.correo = data_update.correo
    if data_update.estado is not None:
        user.estado = data_update.estado
    if data_update.id_role is not None:
        user.id_role = data_update.id_role
    if data_update.cargo is not None:
        user.cargo = data_update.cargo

    await db.commit()
    await db.refresh(user)
    return custom_response(HTTP_200_OK, "Usuario actualizado", True, jsonable_encoder(user))

@router.delete("/{id}", status_code=HTTP_200_OK, response_model=UserSchema)
async def delete_user(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(User).where(User.id_responsable == id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    await db.delete(user)
    await db.commit()
    return custom_response(HTTP_200_OK, "Usuario eliminado correctamente", True)