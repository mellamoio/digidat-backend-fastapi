from .auth_router import router as auth_router
from .user_router import router as user_router
from .role_router import router as role_router
from .role_permission_router import router as role_permission_router
from .document_router import router as document_router
from .obra_router import router as obra_router
from .estado_etapa_router import router as estado_etapa_router
from .etapa_ejecucion_router import router as etapa_ejecucion_router
from .beneficiario_router import router as beneficiario_router
from .informacion_financista_router import router as informacion_financista_router
from .informacion_contratista_router import router as informacion_contratista_router
from .centro_operacion_router import router as centro_operacion_router

__all__ = [
    "auth_router",
    "user_router",
    "role_router",
    "role_permission_router",
    "document_router",
    "obra_router",
    "estado_etapa_router",
    "etapa_ejecucion_router",
    "beneficiario_router",
    "informacion_financista_router",
    "informacion_contratista_router",
    "centro_operacion_router",
]