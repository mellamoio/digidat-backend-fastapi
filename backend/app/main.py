from fastapi import FastAPI
from app.router import project_router, document_router, user_router, role_router, role_permission_router, auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(role_router.router, prefix="/api/v1/role")
app.include_router(user_router.router, prefix="/api/v1/user")

app.include_router(project_router.router, prefix="/api/v1/projects")
app.include_router(document_router.router, prefix="/api/v1/documents")

app.include_router(role_permission_router.router, prefix="/api/v1/role-permission")
app.include_router(auth_router.router, prefix="/api/v1/auth")