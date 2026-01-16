from typing import List, Optional
from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings

import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "DigiDat API"
    DEBUG: bool = False
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = "clave-segura-cambiar-en-produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    MYSQL_ROOT_PASSWORD: str
    MYSQL_DATABASE: str
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3307

    # =====================
    # AWS / S3
    # =====================
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    AWS_BUCKET_NAME: Optional[str] = None

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            "?charset=utf8mb4"
        )

    @property
    def S3_ENABLED(self) -> bool:
        """Verifica si todas las credenciales de S3 están configuradas"""
        return all([
            self.AWS_ACCESS_KEY_ID,
            self.AWS_SECRET_ACCESS_KEY,
            self.AWS_BUCKET_NAME
        ])

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:5173"
    ]

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
        extra = "allow"


settings = Settings()
