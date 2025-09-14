from fastapi import FastAPI, APIRouter

app = FastAPI()

@app.get('/')
def read_root():
    return {'msg': 'Hola desde FastAPI'}
  
api_router = APIRouter(prefix="/api")

@api_router.get('/')
def read_api_root():
    return {'msg': 'Hola desde FastAPI'}

app.include_router(api_router)