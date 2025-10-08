# Digidat Project

Proyecto para la gestión y visualización de datos.  
Incluye frontend en React (Vite + TypeScript), backend en FastAPI y base de datos MySQL.


## Frontend

### Tecnologías
- Vite → Bundler rápido
- React → Framework de UI
- TypeScript → Tipado estático
- styled-components → Estilos dinámicos
- RxJS (Subjects) → Manejo de eventos reactivos
- React Router DOM → Rutas privadas y navegación

## Backend
### Tecnologías

- FastAPI → Framework backend en Python
- MySQL → Base de datos relacional
- JWT Auth → Autenticación y seguridad
- SQLAlchemy → ORM para interacción con la BD

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload --port 8000

# Ejecutar app
npm run dev