import asyncio
import aiomysql

async def main():
    try:
        conn = await aiomysql.connect(host='127.0.0.1', port=3307, user='root', password='rootpassword', db='digidat')
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT DATABASE();")
            database = await cursor.fetchone()
            print(f"✅ Conexión exitosa a MySQL (aiomysql). Base de datos: {database[0]}")
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    asyncio.run(main())