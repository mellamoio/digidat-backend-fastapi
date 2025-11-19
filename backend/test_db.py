import pymysql

try:
    connection = pymysql.connect(
    host='127.0.0.1',
    port=3307,  # ← Cambio aquí
    user='root',
    password='rootpassword',
    database='digidat',
    charset='utf8mb4'
    )
    print("✅ Conexión exitosa a MySQL con root!")
    cursor = connection.cursor()
    cursor.execute("SELECT DATABASE();")
    database = cursor.fetchone()
    print(f"Base de datos: {database[0]}")
    connection.close()
except Exception as e:
    print(f"❌ Error: {e}")
