from fastapi import FastAPI
from router import user_router, role_router

app = FastAPI()

app.include_router(user_router.router)
app.include_router(role_router.router)