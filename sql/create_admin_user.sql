-- Eliminar el usuario admin existente si existe
DELETE FROM usuarios WHERE email = 'admin@digidat.com';

-- Crear un nuevo usuario administrador
INSERT INTO usuarios (nombre, email, password, id_rol, estado, id_usuario_creacion, id_usuario_actualizacion)
VALUES (
    'Administrador', 
    'admin@test.com', 
    -- La contraseña '123' cifrada con bcrypt (hash generado con coste 12)
    '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    1, -- Asumiendo que 1 es el ID del rol de administrador
    'activo',
    1, -- ID del usuario que crea este registro (puede ser 1 para el sistema)
    1  -- ID del usuario que actualiza este registro
);

-- Asignar el rol de administrador al nuevo usuario
INSERT INTO usuarios_roles (id_usuario, id_rol, id_usuario_creacion, id_usuario_actualizacion)
VALUES (LAST_INSERT_ID(), 1, 1, 1);

-- Mostrar el usuario creado
SELECT * FROM usuarios WHERE email = 'admin@test.com';
