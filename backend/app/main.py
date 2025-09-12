from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def read_root():
    return {'msg': 'Hola desde FastAPI'}

