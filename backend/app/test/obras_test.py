# tests/test_obras.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)
BASE_URL = f"{settings.API_V1_STR}/obras"

# Datos de prueba para crear una obra
obra_test_data = {
    "nombre": "Proyecto Prueba",
    "costo_obra": 100000.0,
    "fecha_inicio": "2025-11-10",
    "fecha_fin": "2026-11-10",
    "id_responsable": 1,
    "id_beneficiario": 1
}

@pytest.fixture(scope="module")
def crear_obra():
    """Fixture para crear una obra antes de correr tests y luego devolver su ID"""
    response = client.post(f"{BASE_URL}/", json=obra_test_data)
    assert response.status_code in (200, 201)
    data = response.json()
    yield data  # yield la data para usarla en tests
    # No se elimina al final para soft-delete prueba independiente

def test_crear_obra(crear_obra):
    assert "id_obra" in crear_obra
    assert crear_obra["nombre"] == obra_test_data["nombre"]

def test_listar_obras():
    response = client.get(f"{BASE_URL}/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(o["nombre"] == obra_test_data["nombre"] for o in data)

def test_obtener_obra_por_id(crear_obra):
    obra_id = crear_obra["id_obra"]
    response = client.get(f"{BASE_URL}/{obra_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id_obra"] == obra_id
    assert data["nombre"] == obra_test_data["nombre"]

def test_actualizar_obra(crear_obra):
    obra_id = crear_obra["id_obra"]
    update_data = {
        "nombre": "Obra Actualizada Pytest",
        "costo_obra": 1500000.75,
        "fecha_inicio": "2025-02-01",
        "fecha_fin": "2025-11-30",
    }
    response = client.put(f"{BASE_URL}/{obra_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == update_data["nombre"]
    assert data["costo_obra"] == update_data["costo_obra"]

def test_actualizar_estado_obra(crear_obra):
    obra_id = crear_obra["id_obra"]
    # Cambia el id_estado a uno válido de tu base, aquí pongo 1 como ejemplo
    nuevo_estado_id = 1
    response = client.put(f"{BASE_URL}/{obra_id}/estado/{nuevo_estado_id}")
    assert response.status_code == 200
    data = response.json()
    assert "Estado de la obra" in data["message"]

def test_soft_delete_obra(crear_obra):
    obra_id = crear_obra["id_obra"]
    response = client.delete(f"{BASE_URL}/{obra_id}")
    assert response.status_code == 200
    data = response.json()
    assert "marcada como eliminada" in data["message"].lower()

    # Confirmar que la obra está soft eliminada (opcional)
    response_get = client.get(f"{BASE_URL}/{obra_id}")
    assert response_get.status_code == 404
