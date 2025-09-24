from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from werkzeug.security import check_password_hash
from app.config.db import engine
from app.model.users import users
from app.schema.auth_schema import LoginRequest, LoginResponse, LoginUser
from app.utils.auth import create_access_token
from app.utils.response import custom_response

router = APIRouter(tags=["Auth"])


@router.post("/login", status_code=HTTP_200_OK)
def login(payload: LoginRequest):
    with engine.begin() as conn:
        result = conn.execute(users.select().where(users.c.email == payload.email, users.c.delete_date.is_(None))).first()

    if not result:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Credenciales inválidas")

    row = dict(result._mapping)
    if not check_password_hash(row["password_hash"], payload.password):
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Credenciales inválidas")

    token = create_access_token({
        "sub": str(row["id_user"]),
        "email": row["email"],
        "role": row["id_role"],
        "status": row["status"],
    })

    user = LoginUser(
        id_user=row["id_user"],
        name=row["name"],
        email=row["email"],
        id_role=row["id_role"],
        status=row["status"],
        url_photo=row.get("url_photo"),
        create_date=row.get("create_date"),
    )

    data = LoginResponse(access_token=token, user=user)
    return custom_response(HTTP_200_OK, "Login exitoso", True, data.model_dump())
