from fastapi import APIRouter, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from starlette.status import HTTP_201_CREATED, HTTP_200_OK
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash
from typing import List

from app.schema.user_schema import UserSchema, UserCreateSchema, UserEditSchema
from app.model.users import User
from app.config.db import get_db
from app.utils.response import custom_response

router = APIRouter()

@router.get("/", status_code=HTTP_200_OK, response_model=List[UserSchema])
def get_users(db: Session = Depends(get_db)):
    users_list = db.query(User).all()
    return custom_response(
        HTTP_200_OK,
        "Usuarios obtenidos correctamente",
        True,
        jsonable_encoder(users_list),
    )

@router.post("/", status_code=HTTP_201_CREATED)
def create_user(data_user: UserCreateSchema, db: Session = Depends(get_db)):
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
    db.commit()
    db.refresh(new_user)
    return custom_response(HTTP_201_CREATED, "Usuario creado correctamente", True)

@router.get("/{id}", status_code=HTTP_200_OK, response_model=UserSchema)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_responsable == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return custom_response(HTTP_200_OK, "Usuario encontrado", True, jsonable_encoder(user))

@router.put("/{id}", status_code=HTTP_200_OK, response_model=UserEditSchema)
def update_user(id: int, data_update: UserEditSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_responsable == id).first()
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

    db.commit()
    db.refresh(user)
    return custom_response(HTTP_200_OK, "Usuario actualizado", True, jsonable_encoder(user))

@router.delete("/{id}", status_code=HTTP_200_OK, response_model=UserSchema)
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id_responsable == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
    return custom_response(HTTP_200_OK, "Usuario eliminado correctamente", True)