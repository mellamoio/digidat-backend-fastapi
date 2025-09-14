# 🚀 Digidat Project

Proyecto fullstack para la gestión y visualización de datos.  
Incluye frontend en React (Vite + TypeScript), backend en FastAPI y base de datos MySQL.


---

## Frontend

### Tecnologías
- Vite → Bundler rápido
- React → Framework de UI
- TypeScript → Tipado estático
- styled-components → Estilos dinámicos
- Ant Design → Componentes de UI
- React Icons → Iconos personalizables
- Storybook → Documentación de componentes
- RxJS (Subjects) → Manejo de eventos reactivos
- React Router DOM → Rutas privadas y navegación
- Jest + React Testing Library → Testing

### Scripts principales

# Instalar dependencias
cd frontend
npm install

# Ejecutar app
npm run dev

# Ejecutar Storybook
npm run storybook

# Ejecutar tests
npm run test


---

## Backend
### Tecnologías

- FastAPI → Framework backend en Python
- MySQL → Base de datos relacional
- JWT Auth → Autenticación y seguridad
- SQLAlchemy → ORM para interacción con la BD
- Scripts principales

# Activar entorno virtual
cd backend
python -m venv venv
venv\Scripts\activate      # Windows

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload --port 8000