from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)
BASE_URL = f"{settings.API_V1_STR}/users"


def test_crear_usuario():
    #DATOS NUEVOS DE PRUEBA
    datos = {
        "nombre": "Keiko Fujimori",
        "correo": "keiko@test.com",
        "password": "keiko123",
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
    usuario = next((u for u in usuarios if u["correo"] == "keiko@test.com"), None)
    assert usuario is not None

    id_usuario = usuario["id_responsable"]

    datos_actualizados = {
        "nombre": "Keiko Fujimori",
        "correo": "keikoo@test.com",
        "password": "keikosofia123",
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
    usuario = next((u for u in usuarios if u["correo"] == "keikoo@test.com"), None)
    assert usuario is not None

    id_usuario = usuario["id_responsable"]

    respuesta = client.delete(f"{BASE_URL}/{id_usuario}")
    body = respuesta.json()
    print(body)

    assert respuesta.status_code == 200
    assert body["response_code"] is True
    assert "Usuario eliminado correctamente" in body["message"]
