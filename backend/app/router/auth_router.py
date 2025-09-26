from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from werkzeug.security import check_password_hash
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.model.users import User
from app.schema.auth_schema import LoginRequest
from app.utils.auth import create_access_token
from app.utils.response import custom_response
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Auth"])

@router.post("/login", status_code=HTTP_200_OK)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        logger.debug(f"Request payload: {payload.dict()}")
        user = db.query(User).filter(User.correo == payload.correo).first()
        if not user:
            logger.warning(f"Intento de inicio de sesión fallido para el correo: {payload.correo}")
            return custom_response(
                HTTP_400_BAD_REQUEST,
                "Credenciales inválidas",
                False,
                {}
            )

        if not user.contrasena_hash or not check_password_hash(user.contrasena_hash, payload.password):
            logger.warning(f"Contraseña incorrecta para el usuario: {payload.correo}")
            return custom_response(
                HTTP_400_BAD_REQUEST,
                "Credenciales inválidas",
                False,
                {}
            )

        token = create_access_token({
            "sub": str(user.id_responsable),
            "correo": user.correo,
            "role": user.id_role,
            "status": user.estado,
        })

        user_data = {
            "id_user": user.id_responsable,
            "name": user.nombre,
            "email": user.correo,
            "id_role": user.id_role,
            "status": user.estado.value if hasattr(user.estado, "value") else user.estado,
            "url_photo": None,
            "create_date": None
        }

        response_data = {
            "access_token": token,
            "token_type": "bearer",
            "user": user_data
        }

        logger.info(f"Inicio de sesión exitoso para el usuario: {payload.correo}")
        return custom_response(
            HTTP_200_OK,
            "Inicio de sesión exitoso",
            True,
            response_data
        )

    except Exception as e:
        logger.error(f"Error en el inicio de sesión: {str(e)}", exc_info=True)
        return custom_response(
            HTTP_500_INTERNAL_SERVER_ERROR,
            "Error interno del servidor al procesar la solicitud",
            False,
            {"error": str(e)}
        )