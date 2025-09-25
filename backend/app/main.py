import logging
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
from typing import List, Optional
from pydantic import AnyHttpUrl

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger(__name__)

# Configuración de la aplicación
from app.core.config import settings
from app.core.database import create_tables, async_create_tables
from app.core.exceptions import register_exception_handlers

# Importar routers
from app.router import (
    obra_router,
    estado_etapa_router,
    etapa_ejecucion_router,
    responsable_router,
    beneficiario_router,
    informacion_financista_router,
    informacion_contratista_router,
    user_router,
    role_router,
    auth_router,
    project_router,
    document_router,
    role_permission_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código que se ejecuta al iniciar la aplicación
    logger.info("Iniciando la aplicación...")
    try:
        create_tables()
        await async_create_tables()
        logger.info("Tablas de la base de datos creadas correctamente")
    except Exception as e:
        logger.error(f"Error al crear tablas: {str(e)}")
        raise
    
    yield
    
    # Código que se ejecuta al detener la aplicación
    logger.info("Deteniendo la aplicación...")

# Crear la aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la gestión de obras, proyectos y usuarios",
    version="1.0.0",
    debug=settings.DEBUG,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS] if settings.BACKEND_CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redirigir a HTTPS en producción
if not settings.DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)

# Middleware para manejo de sesiones
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="session",
    max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
)

# Registrar manejadores de excepciones
app = register_exception_handlers(app)

# Incluir routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR, tags=["Autenticación"])
app.include_router(user_router.router, prefix=settings.API_V1_STR, tags=["Usuarios"])
app.include_router(role_router.router, prefix=settings.API_V1_STR, tags=["Roles"])
app.include_router(role_permission_router.router, prefix=settings.API_V1_STR, tags=["Permisos de Roles"])
app.include_router(project_router.router, prefix=settings.API_V1_STR, tags=["Proyectos"])
app.include_router(document_router.router, prefix=settings.API_V1_STR, tags=["Documentos"])
app.include_router(obra_router.router, prefix=settings.API_V1_STR, tags=["Obras"])
app.include_router(estado_etapa_router.router, prefix=settings.API_V1_STR, tags=["Estados de Etapa"])
app.include_router(etapa_ejecucion_router.router, prefix=settings.API_V1_STR, tags=["Etapas de Ejecución"])
app.include_router(responsable_router.router, prefix=settings.API_V1_STR, tags=["Responsables"])
app.include_router(beneficiario_router.router, prefix=settings.API_V1_STR, tags=["Beneficiarios"])
app.include_router(informacion_financista_router.router, prefix=settings.API_V1_STR, tags=["Información Financistas"])
app.include_router(informacion_contratista_router.router, prefix=settings.API_V1_STR, tags=["Información Contratistas"])

# Ruta de verificación de salud
@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    """
    Verifica el estado de salud de la API.
    """
    return {
        "status": "ok",
        "version": "1.0.0",
        "environment": "development" if settings.DEBUG else "production"
    }

# Ruta de bienvenida
@app.get("/")
async def root():
    """
    Ruta de bienvenida de la API.
    """
    return {
        "message": f"Bienvenido a {settings.PROJECT_NAME} API",
        "documentation": "/docs" if settings.DEBUG else None,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        ssl_keyfile=getattr(settings, 'SSL_KEYFILE', None),
        ssl_certfile=getattr(settings, 'SSL_CERTFILE', None)
    )