from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException
from pydantic import ValidationError
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

class AppException(Exception):
    """Clase base para excepciones personalizadas de la aplicación."""
    
    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail: str = "Ocurrió un error inesperado",
        error_code: Optional[str] = None,
        **extra: Any
    ) -> None:
        self.status_code = status_code
        self.detail = detail
        self.error_code = error_code or f"ERR-{status_code:03d}"
        self.extra = extra
        super().__init__(detail)

class NotFoundException(AppException):
    """Excepción para recursos no encontrados."""
    
    def __init__(self, detail: str = "Recurso no encontrado", **kwargs: Any) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="NOT_FOUND",
            **kwargs
        )

class UnauthorizedException(AppException):
    """Excepción para autenticación fallida o no autorizada."""
    
    def __init__(self, detail: str = "No autorizado", **kwargs: Any) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="UNAUTHORIZED",
            **kwargs
        )

class ForbiddenException(AppException):
    """Excepción para acceso denegado."""
    
    def __init__(self, detail: str = "Acceso denegado", **kwargs: Any) -> None:
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="FORBIDDEN",
            **kwargs
        )

class BadRequestException(AppException):
    """Excepción para solicitudes incorrectas."""
    
    def __init__(self, detail: str = "Solicitud incorrecta", **kwargs: Any) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code="BAD_REQUEST",
            **kwargs
        )

async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Maneja errores de validación de Pydantic."""
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"][1:])  # Ignorar el prefijo del modelo
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Error de validación",
            "errors": errors
        },
    )

async def http_exception_handler(
    request: Request, exc: HTTPException
) -> JSONResponse:
    """Maneja excepciones HTTP estándar."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": getattr(exc, "error_code", f"HTTP_{exc.status_code}")
        },
    )

async def app_exception_handler(
    request: Request, exc: AppException
) -> JSONResponse:
    """Maneja excepciones personalizadas de la aplicación."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.error_code,
            **exc.extra
        },
    )

async def unhandled_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Maneja excepciones no controladas."""
    logger.exception("Excepción no controlada", exc_info=exc)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Error interno del servidor",
            "error_code": "INTERNAL_SERVER_ERROR"
        },
    )

def register_exception_handlers(app):
    """Registra los manejadores de excepciones en la aplicación FastAPI."""
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
    
    return app
