from typing import List
from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings

import os
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "DigiDat API"
    DEBUG: bool = False
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "clave-segura-cambiar-en-produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # MySQL (DECLARADAS EXPLÍCITAMENTE)
    MYSQL_ROOT_PASSWORD: str
    MYSQL_DATABASE: str
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3307

    # =====================
    # AWS / S3
    # =====================
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    AWS_BUCKET_NAME: str

    # SQLAlchemy URL (construida, no por os.getenv)
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            "?charset=utf8mb4"
        )

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:5173"
    ]

    # Usuarios iniciales
    FIRST_SUPERUSER: EmailStr = "admin@test.com"
    FIRST_SUPERUSER_PASSWORD: str = "123"

    EMAIL_AUTH_ADMIN: EmailStr = "admin@test.com"
    PASS_AUTH_ADMIN: str = "admin123"
    EMAIL_AUTH_IOSEF: EmailStr = "iosef@test.com"
    PASS_AUTH_IOSEF: str = "iosef123"
    EMAIL_AUTH_ERICK: EmailStr = "erick@test.com"
    PASS_AUTH_ERICK: str = "erick123"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "forbid"


settings = Settings()
