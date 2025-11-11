import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.config.db import get_db
from app.model.document import Documento
from app.core.config import settings

client = TestClient(app)
BASE_URL = f"{settings.API_V1_STR}/documentos"

documento_base = {
    "nombre": "Documento prueba",
    "ruta": "/docs/prueba.pdf",
    "mime_type": "application/pdf",
    "tamano_bytes": 2048,
    "uploaded_by": 1,
    "id_obra": 1,
    "id_etapa": 1,
    "id_informacion_financista": None,
    "id_informacion_contratista": None,
    "id_pago": None,
}

# Fixture para obtener una sesión de base de datos para los tests
@pytest.fixture
def db_session():
    db = next(get_db())
    yield db
    db.close()

@pytest.fixture
def crear_documento(db_session: Session):
    doc = Documento(
        nombre=documento_base["nombre"],
        ruta=documento_base["ruta"],
        mime_type=documento_base["mime_type"],
        tamano_bytes=documento_base["tamano_bytes"],
        uploaded_by=documento_base["uploaded_by"],
        id_obra=documento_base["id_obra"],
        id_etapa=documento_base["id_etapa"],
        id_informacion_financista=documento_base["id_informacion_financista"],
        id_informacion_contratista=documento_base["id_informacion_contratista"],
        id_pago=documento_base["id_pago"],
        delete_date=None,
    )
    db_session.add(doc)
    db_session.commit()
    db_session.refresh(doc)
    yield doc
    db_session.delete(doc)
    db_session.commit()

def test_create_un_documento():
    payload = documento_base.copy()
    response = client.post(BASE_URL + "/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert isinstance(data, list)
    doc = data[0]
    for key in documento_base:
        assert doc[key] == documento_base[key]

def test_create_varios_documentos():
    payload = [
        {**documento_base, "nombre": "Doc 1"},
        {**documento_base, "nombre": "Doc 2"},
    ]
    response = client.post(BASE_URL + "/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert len(data) == 2
    assert data[0]["nombre"] == "Doc 1"
    assert data[1]["nombre"] == "Doc 2"

def test_get_documentos(crear_documento):
    response = client.get(BASE_URL + "/")
    assert response.status_code == 200
    data = response.json()
    assert any(d["id_documento"] == crear_documento.id_documento for d in data)

def test_get_documento_por_id(crear_documento):
    response = client.get(f"{BASE_URL}/{crear_documento.id_documento}")
    assert response.status_code == 200
    data = response.json()
    assert data["id_documento"] == crear_documento.id_documento
    assert data["nombre"] == crear_documento.nombre

def test_get_documento_por_id_no_existe():
    response = client.get(f"{BASE_URL}/999999")
    assert response.status_code == 404

def test_update_documento(crear_documento):
    payload = {
        "descripcion": "Nuevo valor que quizás sea un campo que tienes o ajusta a tu modelo",
        "nombre": "Nombre actualizado"
    }
    response = client.patch(f"{BASE_URL}/{crear_documento.id_documento}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Nombre actualizado"

def test_update_documento_no_existe():
    payload = {"nombre": "No existe"}
    response = client.patch(f"{BASE_URL}/999999", json=payload)
    assert response.status_code == 404

def test_soft_delete_documento(crear_documento):
    doc_id = crear_documento.id_documento
    response = client.delete(f"{BASE_URL}/{doc_id}")
    assert response.status_code == 204

    response_get = client.get(f"{BASE_URL}/{doc_id}")
    assert response_get.status_code == 404

