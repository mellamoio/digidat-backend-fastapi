
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)
BASE_URL = f"{settings.API_V1_STR}/users"

TEST_USER_NAME = settings.TEST_USER_NAME
TEST_USER_PASSWORD = settings.TEST_USER_PASSWORD
TEST_USER_PASSWORD_NO_EXISTS = settings.TEST_USER_PASSWORD_NO_EXISTS
TEST_USER_EMAIL = settings.TEST_USER_EMAIL

def test_crear_usuario():
    #DATOS NUEVOS DE PRUEBA
    datos = {
        "nombre": TEST_USER_NAME,
        "correo": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD,
        "estado": "ACTIVO",
        "id_role": 2,
        "cargo": "Presidenta"
    }
    respuesta = client.post(BASE_URL, json=datos)
    body = respuesta.json()
    print(body)

    assert respuesta.status_code == 201
    assert body["response_code"] is True
    assert "Usuario creado correctamente" in body["message"]


def test_listar_usuarios():
    respuesta = client.get(BASE_URL)
    body = respuesta.json()
    print(body)

    assert respuesta.status_code == 200
    assert body["response_code"] is True
    assert isinstance(body["data"], list)
    assert len(body["data"]) > 0


def test_actualizar_usuario():
    # buscamos el usuario creado en el test anterior
    usuarios = client.get(BASE_URL).json()["data"]
    usuario = next((u for u in usuarios if u["correo"] == TEST_USER_EMAIL), None)
    assert usuario is not None

    id_usuario = usuario["id_responsable"]

    datos_actualizados = {
        "nombre": "Keiko Fujimori",
        "correo": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD,
        "estado": "ACTIVO",
        "id_role": 2,
        "cargo": "Prisionera"
    }
    respuesta = client.put(f"{BASE_URL}/{id_usuario}", json=datos_actualizados)
    body = respuesta.json()
    print(body)

    assert respuesta.status_code == 200
    assert body["response_code"] is True
    assert "Usuario actualizado" in body["message"]


def test_eliminar_usuario():
    # buscamos el usuario editado para eliminarlo
    usuarios = client.get(BASE_URL).json()["data"]
    usuario = next((u for u in usuarios if u["correo"] == TEST_USER_EMAIL), None)
    assert usuario is not None

    id_usuario = usuario["id_responsable"]

    respuesta = client.delete(f"{BASE_URL}/{id_usuario}")
    body = respuesta.json()
    print(body)

    assert respuesta.status_code == 200
    assert body["response_code"] is True
    assert "Usuario eliminado correctamente" in body["message"]
