import os
from app.core.config import settings
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

EMAIL_AUTH_ADMIN = settings.EMAIL_AUTH_ADMIN
PASS_AUTH_ADMIN = settings.PASS_AUTH_ADMIN

EMAIL_AUTH_IOSEF = settings.EMAIL_AUTH_IOSEF
PASS_AUTH_IOSEF = settings.PASS_AUTH_IOSEF

EMAIL_AUTH_ERICK = settings.EMAIL_AUTH_ERICK
PASS_AUTH_ERICK = settings.PASS_AUTH_ERICK



TEST_USER_PASSWORD = settings.TEST_USER_PASSWORD
TEST_USER_PASSWORD_NO_EXISTS = settings.TEST_USER_PASSWORD_NO_EXISTS
TEST_USER_EMAIL = settings.TEST_USER_EMAIL

BASE_URL = f"{settings.API_V1_STR}/auth/login"

def test_login_admin():
    datos = {"correo": EMAIL_AUTH_ADMIN, "password": PASS_AUTH_ADMIN}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    print(body)
    assert respuesta.status_code == 200
    assert "access_token" in body["data"]

def test_login_iosef():
    datos = {"correo": EMAIL_AUTH_IOSEF, "password": PASS_AUTH_IOSEF}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 200
    assert "access_token" in body["data"]
    assert body["response_code"] is True

def test_login_erick():
    datos = {"correo": EMAIL_AUTH_ERICK, "password": PASS_AUTH_ERICK}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 200
    assert "access_token" in body["data"]
    assert body["response_code"] is True

def test_login_usuario_inexistente():
    datos = {"correo": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 400
    assert body["response_code"] is False
    assert body["message"] == "Credenciales inválidas"

def test_login_contraseña_incorrecta():
    datos = {"correo": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD_NO_EXISTS}
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    assert respuesta.status_code == 400
    assert body["response_code"] is False
    assert "message" in body
