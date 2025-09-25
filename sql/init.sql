-- Crear el usuario si no existe
CREATE USER IF NOT EXISTS 'digidat_user'@'%' IDENTIFIED BY 'digidat_password';
GRANT ALL PRIVILEGES ON digidat_db.* TO 'digidat_user'@'%';
FLUSH PRIVILEGES;

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS digidat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE digidat_db;