from pydantic import AnyHttpUrl, EmailStr, validator
from pydantic_settings import BaseSettings
from typing import List, Optional, Union
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "DigiDat API"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "clave-segura-cambiar-en-produccion")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root@localhost/proyecto_obras?charset=utf8mb4"
    )

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:5173"]

    # Configuración de usuarios
    FIRST_SUPERUSER: EmailStr = "admin@test.com"
    FIRST_SUPERUSER_PASSWORD: str = "123"

    #PRUEBA TEST AUTH
    EMAIL_AUTH_ADMIN: EmailStr = "admin@test.com"
    PASS_AUTH_ADMIN: str = "admin123"
    EMAIL_AUTH_IOSEF: EmailStr = "iosef@test.com"
    PASS_AUTH_IOSEF: str = "iosef123"
    EMAIL_AUTH_ERICK: EmailStr = "erick@test.com"
    PASS_AUTH_ERICK: str = "erick123"

    #USARIO DE PRUEBA
    TEST_USER_NAME: str = "usuario_prueba"
    TEST_USER_PASSWORD: str = "prueba123"
    TEST_USER_PASSWORD_NO_EXISTS: str = "noexiste123"
    TEST_USER_EMAIL: EmailStr = "prueba@test.com"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()