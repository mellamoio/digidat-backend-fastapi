from locust import HttpUser, task, between
from core.config import settings
import uuid


class UserApiUser(HttpUser):
    wait_time = between(1, 3)
    base_url = f"{settings.API_V1_STR}/users"
    user_counter = 0
    
    @task(2)
    def list_users(self):
        self.client.get(self.base_url + "/")
    
    @task(1)
    def create_user(self):
        payload = self.generate_user_payload()
        response = self.client.post(self.base_url + "/", json=payload)
        
        try:
            response_data = response.json()
        except ValueError:
            response_data = {}

        if response.status_code == 201:
            self.id_responsable = response_data.get("data", {}).get("id_responsable")
        else:
            self.id_responsable = None
    
    @task(1)
    def get_user_by_id(self):
        if hasattr(self, "id_responsable") and self.id_responsable:
            self.client.get(f"{self.base_url}/{self.id_responsable}")
    
    @task(1)
    def update_user(self):
        if hasattr(self, "id_responsable") and self.id_responsable:
            unique_id = uuid.uuid4().hex[:8]
            payload = {
                "nombre": "Usuario Actualizado",
                "correo": f"usuario_actualizado{unique_id}@test.com",
                "password": "nuevaClave123",
                "estado": "INACTIVO",
                "id_role": 2,
                "cargo": "Developer"
            }
            self.client.put(f"{self.base_url}/{self.id_responsable}", json=payload)
    
    @task(1)
    def delete_user(self):
        if hasattr(self, "id_responsable") and self.id_responsable:
            self.client.delete(f"{self.base_url}/{self.id_responsable}")
            self.id_responsable = None
