from app.core.config import settings
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

BASE_URL = f"{settings.API_V1_STR}/auth/login"

def test_login_admin():
    datos = {"correo": "admin@test.com", "password": "admin123"}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    print(body)
    assert respuesta.status_code == 200
    assert "access_token" in body["data"]

def test_login_iosef():
    datos = {"correo": "iosef@test.com", "password": "iosef123"}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 200
    assert "access_token" in body["data"]
    assert body["response_code"] is True

def test_login_erick():
    datos = {"correo": "erick@test.com", "password": "erick123"}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 200
    assert "access_token" in body["data"]
    assert body["response_code"] is True

def test_login_usuario_inexistente():
    datos = {"correo": "prueba@test.com", "password": "1234"}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 400
    assert body["response_code"] is False
    assert body["message"] == "Credenciales inválidas"

def test_login_contraseña_incorrecta():
    datos = {"correo": "noexiste@test.com", "password": "1234"}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 400
    assert body["response_code"] is False
    assert "message" in body
