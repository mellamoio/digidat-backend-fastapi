from werkzeug.security import generate_password_hash
from app.config.db import SessionLocal
from app.model.users import User

def update_passwords():
    db = SessionLocal()
    try:
        # Define contraseñas únicas para cada usuario
        user_passwords = {
            "admin@test.com": "admin123",
            "iosef@test.com": "iosef123",
            "erick@test.com": "erick123"
        }
        users = db.query(User).all()
        for user in users:
            if user.correo in user_passwords:
                user.contrasena_hash = generate_password_hash(user_passwords[user.correo], method="pbkdf2:sha256")
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    update_passwords()