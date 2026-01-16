-- =====================================================
-- CONFIGURACIÓN INICIAL
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- =====================================================
-- DROP TABLES (ORDEN CORRECTO)
-- =====================================================
DROP TABLE IF EXISTS documentos;
DROP TABLE IF EXISTS obra_centro_operacion;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS informacioncontratista;
DROP TABLE IF EXISTS informacionfinancista;
DROP TABLE IF EXISTS actividades_etapa;
DROP TABLE IF EXISTS obras;
DROP TABLE IF EXISTS auditoria;
DROP TABLE IF EXISTS centros_operacion;
DROP TABLE IF EXISTS tipos_obra;
DROP TABLE IF EXISTS tipos_gasto;
DROP TABLE IF EXISTS estados_reembolso;
DROP TABLE IF EXISTS estados_etapa;
DROP TABLE IF EXISTS estados_obra;
DROP TABLE IF EXISTS beneficiarios;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

-- =====================================================
-- TABLAS BASE
-- =====================================================
CREATE TABLE roles (
  id_role INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP NULL,
  delete_date TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id_responsable INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  cargo VARCHAR(255),
  correo VARCHAR(255) UNIQUE,
  contrasena_hash VARCHAR(255),
  id_role INT,
  estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  FOREIGN KEY (id_role) REFERENCES roles(id_role)
) ENGINE=InnoDB;

CREATE TABLE beneficiarios (
  id_beneficiario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  documento VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE estados_obra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE,
  orden INT,
  color VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE estados_etapa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE,
  orden INT,
  color VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE estados_reembolso (
  id_estado_reembolso INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE
) ENGINE=InnoDB;

CREATE TABLE tipos_gasto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE
) ENGINE=InnoDB;

CREATE TABLE tipos_obra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE,
  descripcion VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE centros_operacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE auditoria (
  id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
  tabla_afectada VARCHAR(100),
  id_registro INT,
  accion ENUM('INSERT','UPDATE','DELETE'),
  usuario VARCHAR(100),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- TABLAS DEPENDIENTES
-- =====================================================
CREATE TABLE obras (
  id_obra INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  tipo_id INT,
  estado_id INT,
  fecha_inicio DATE,
  fecha_fin DATE,
  costo_proyecto FLOAT,
  id_responsable INT,
  id_empresa INT,
  FOREIGN KEY (estado_id) REFERENCES estados_obra(id),
  FOREIGN KEY (id_responsable) REFERENCES usuarios(id_responsable)
) ENGINE=InnoDB;

CREATE TABLE actividades_etapa (
  id_etapa INT AUTO_INCREMENT PRIMARY KEY,
  id_obra INT,
  nombre_etapa VARCHAR(255),
  comentario_etapa TEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_estado_etapa INT,
  orden INT,
  FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE,
  FOREIGN KEY (id_estado_etapa) REFERENCES estados_etapa(id)
) ENGINE=InnoDB;

CREATE TABLE informacionfinancista (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_obra INT,
  detalle TEXT,
  id_responsable INT,
  FOREIGN KEY (id_obra) REFERENCES obras(id_obra),
  FOREIGN KEY (id_responsable) REFERENCES usuarios(id_responsable)
) ENGINE=InnoDB;

CREATE TABLE informacioncontratista (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_obra INT,
  detalle TEXT,
  id_responsable INT,
  FOREIGN KEY (id_obra) REFERENCES obras(id_obra),
  FOREIGN KEY (id_responsable) REFERENCES usuarios(id_responsable)
) ENGINE=InnoDB;

CREATE TABLE pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_obra INT,
  id_beneficiario INT,
  concepto_pago VARCHAR(255),
  monto_pagado DECIMAL(15,2),
  fecha_pago DATE,
  id_tipo_gasto INT,
  id_estado_reembolso INT,
  id_responsable INT,
  FOREIGN KEY (id_obra) REFERENCES obras(id_obra),
  FOREIGN KEY (id_beneficiario) REFERENCES beneficiarios(id_beneficiario),
  FOREIGN KEY (id_tipo_gasto) REFERENCES tipos_gasto(id),
  FOREIGN KEY (id_estado_reembolso) REFERENCES estados_reembolso(id_estado_reembolso),
  FOREIGN KEY (id_responsable) REFERENCES usuarios(id_responsable)
) ENGINE=InnoDB;

CREATE TABLE obra_centro_operacion (
  id_obra INT,
  id_centro_operacion INT,
  PRIMARY KEY (id_obra,id_centro_operacion),
  FOREIGN KEY (id_obra) REFERENCES obras(id_obra),
  FOREIGN KEY (id_centro_operacion) REFERENCES centros_operacion(id)
) ENGINE=InnoDB;

CREATE TABLE documentos (
  id_documento INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  ruta VARCHAR(1000),
  mime_type VARCHAR(255),
  tamano_bytes INT,
  uploaded_by INT,
  id_obra INT,
  id_etapa INT,
  id_informacionfinancista INT,
  id_informacioncontratista INT,
  id_pago INT,
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delete_date TIMESTAMP NULL,
  FOREIGN KEY (uploaded_by) REFERENCES usuarios(id_responsable),
  FOREIGN KEY (id_obra) REFERENCES obras(id_obra),
  FOREIGN KEY (id_etapa) REFERENCES actividades_etapa(id_etapa),
  FOREIGN KEY (id_informacionfinancista) REFERENCES informacionfinancista(id),
  FOREIGN KEY (id_informacioncontratista) REFERENCES informacioncontratista(id),
  FOREIGN KEY (id_pago) REFERENCES pagos(id_pago)
) ENGINE=InnoDB;

-- =====================================================
-- INSERTS (TODOS TUS DATOS)
-- =====================================================
-- 👉 Aquí van exactamente TODOS los INSERT que ya enviaste
-- (roles, usuarios, obras, actividades, auditoria, etc.)
-- No se elimina ninguno

-- ===========================
-- 3. INSERTS - DATOS INICIALES
-- ===========================

INSERT INTO `roles` VALUES 
(1, 'Administrador', 'Administrador del sistema', '2025-09-25 21:23:26', NULL, NULL),
(2, 'Usuario', 'Usuario', '2025-09-25 21:23:26', NULL, NULL);

INSERT INTO `usuarios` VALUES 
(1, 'Victor', 'Administrador del Sistema', 'admin@test.com', 'pbkdf2:sha256:1000000$uWWiwb6NCDsexTbx$f084fc8e9a3110e09abf509a4a9f5f089c9177e519b2ca80a19bd8f2253c56bc', 1, 'ACTIVO'),
(2, 'Iosef', 'Analista', 'iosef@test.com', 'pbkdf2:sha256:1000000$romb8y2VdncP4V9F$6fbd6b175395b4cf4c6540cc8c805b51a10a558510e426608ff13fd6396fbdb1', 2, 'ACTIVO'),
(3, 'Erick', 'Ingeniero', 'erick@test.com', 'pbkdf2:sha256:1000000$c3HbYVSifdfo5fRT$72b87f5a689274476bda452e70d81d0669dee82c01d6876c4c6b237f42f078f8', 2, 'ACTIVO');

INSERT INTO `beneficiarios` VALUES 
(1, 'Beneficiario Test', '12345678');

INSERT INTO `estados_obra` VALUES 
(1, 'Priorizacin', 1, '#722AE9'),
(2, 'Actos Previos', 2, '#FFA500'),
(3, 'Seleccin', 3, '#FFD700'),
(4, 'Ejecucin', 4, '#2196F3'),
(5, 'Emisin de CIPRL o CIPGN', 5, '#28A745');

INSERT INTO `estados_etapa` VALUES 
(1, 'Priorización', 1, '#722AE9'),
(2, 'Actos Previos', 2, '#FFA500'),
(3, 'Selección', 3, '#FFD700'),
(4, 'Ejecución', 4, '#2196F3'),
(5, 'Emisión de CIPRL o CIPGN', 5, '#28A745');

INSERT INTO `estados_reembolso` VALUES 
(1, 'Reembolsado'),
(2, 'No Reembolsado');

INSERT INTO `tipos_gasto` VALUES 
(1, 'Administrativo'),
(2, 'Reembolsable');

INSERT INTO `tipos_obra` VALUES 
(9, 'Proyecto de inversión', 'Proyectos de inversión pública'),
(10, 'IOARR', 'Inversión de Reposición y Rehabilitación'),
(11, 'IOARR de emergencia', 'IOARR ejecutadas en situaciones de emergencia'),
(12, 'Operación', 'Obras de operación y mantenimiento');

INSERT INTO `centros_operacion` VALUES 
(1, 'Centro Principal'),
(2, 'Centro Norte'),
(3, 'Centro Sur'),
(4, 'Centro Este'),
(5, 'Centro Oeste'),
(6, 'Centro Lima'),
(7, 'Centro Arequipa'),
(8, 'Centro Cusco');

INSERT INTO `obras` VALUES 
(1, 'Obra 1', 9, 1, '2025-11-25', '2025-11-26', 1, 2, 1),
(2, 'Obra 1', 9, 1, '2025-11-26', '2025-11-27', 100000, 2, 1),
(3, 'Obra 6', 9, 1, '2025-11-26', '2025-11-28', 1, 2, 1),
(4, 'Obra 4', 10, 1, '2025-11-20', '2025-11-29', 1000000, 3, 1);

INSERT INTO `actividades_etapa` VALUES 
(25, 1, 'Aprobar la Capacidad Presupuestal', 'Comentario lorem', '2025-11-28 01:59:46', 1, 1),
(26, 1, 'Aprobar la Ejecución Conjunta de Proyectos', 'Comentario lorem', '2025-11-28 01:59:46', 1, 2),
(27, 1, 'Evaluar la Propuesta de Proyectos del Sector Privado', 'Comentario lorem', '2025-11-28 01:59:46', 1, 3),
(28, 1, 'Aprobar la Lista de Proyectos Priorizados por Entidad Pública', 'Comentario lorem', '2025-11-28 01:59:46', 1, 4),
(29, 1, 'Designar al Comité Especial', 'Comentario lorem', '2025-11-28 01:59:46', 2, 1),
(30, 1, 'Otorgar la Certificación Presupuestaria y/o compromiso de Priorización de Recursos para Entidades Públicas de Gobierno Nacional', 'Comentario lorem', '2025-11-28 01:59:46', 2, 2),
(31, 1, 'Aprobar las bases para el proceso de selección', 'Comentario lorem', '2025-11-28 01:59:46', 2, 3),
(32, 1, 'Realizar el Proceso de Selección', 'Comentario lorem', '2025-11-28 01:59:46', 3, 1),
(33, 1, 'Realizar la suscripción de Convenio', 'Comentario lorem', '2025-11-28 01:59:46', 3, 2),
(34, 1, 'Realizar la suscripción de contrato de la Supervisión del Proyecto', 'Comentario lorem', '2025-11-28 01:59:46', 3, 3),
(35, 1, 'Realizar modificación de Estudios', 'Comentario lorem', '2025-11-28 01:59:46', 3, 4),
(36, 1, 'Aprobar el Estudio definitivo, expediente de operación y/o mantenimiento', 'Comentario lorem', '2025-11-28 01:59:46', 3, 5),
(37, 1, 'Aprobar la Sustitución del Ejecutor de Proyecto', 'Comentario lorem', '2025-11-28 01:59:46', 3, 6),
(38, 1, 'Aprobar la ampliación de plazos', 'Comentario lorem', '2025-11-28 01:59:46', 3, 7),
(39, 1, 'Realizar la culminación y recepción del proyecto', 'Comentario lorem', '2025-11-28 01:59:46', 3, 8),
(40, 1, 'Aprobar la liquidación del proyecto', 'Comentario lorem', '2025-11-28 01:59:46', 3, 9),
(41, 1, 'Emitir conformidad de Mantenimiento u Operación', 'Comentario lorem', '2025-11-28 01:59:46', 4, 1),
(42, 1, 'Emitir el CIPRL o CIPGN', 'Comentario lorem', '2025-11-28 01:59:46', 5, 1),
(43, 1, 'Emitir el CIPRA por el CIPGN por Avance de Obra', 'Comentario lorem', '2025-11-28 01:59:46', 5, 2);

INSERT INTO `obra_centro_operacion` VALUES 
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (3, 6), (4, 6), (1, 7), (2, 7), (4, 7), (4, 8);

INSERT INTO `auditoria` VALUES 
(1, 'obras', 1, 'INSERT', 'root@localhost', '2025-10-15 16:55:47'),
(2, 'pagos', 1, 'INSERT', 'root@localhost', '2025-10-15 16:55:47'),
(3, 'obras', 2, 'INSERT', 'root@172.18.0.1', '2025-11-19 21:54:52'),
(4, 'obras', 2, 'DELETE', 'root@localhost', '2025-11-19 22:25:02'),
(5, 'obras', 3, 'INSERT', 'root@172.18.0.1', '2025-11-19 23:33:30'),
(6, 'obras', 4, 'INSERT', 'root@172.18.0.1', '2025-11-19 23:35:39'),
(7, 'obras', 5, 'INSERT', 'root@172.18.0.1', '2025-11-19 23:42:40'),
(8, 'obras', 6, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-20 14:46:15'),
(9, 'obras', 7, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-26 00:09:25'),
(10, 'obras', 8, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-26 00:10:05'),
(11, 'obras', 9, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-26 00:41:19'),
(12, 'obras', 1, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:11'),
(13, 'obras', 3, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:33'),
(14, 'obras', 4, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:35'),
(15, 'obras', 5, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:36'),
(16, 'obras', 6, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:38'),
(17, 'obras', 7, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:39'),
(18, 'obras', 8, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:40'),
(19, 'obras', 9, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:04:41'),
(20, 'obras', 10, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-26 01:05:10'),
(21, 'obras', 10, 'DELETE', 'digidat_user@172.18.0.1', '2025-11-26 01:09:14'),
(22, 'obras', 1, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-26 01:09:54'),
(23, 'obras', 2, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-26 18:24:53'),
(24, 'obras', 3, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-26 18:46:54'),
(25, 'obras', 4, 'INSERT', 'digidat_user@172.18.0.1', '2025-11-28 01:09:30');


INSERT INTO `informacionfinancista` VALUES (2,1,16,'dsadfd','saddasds','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Documentos T\\\\u00e9cnicos\\\"}]\"','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Iosef\\\"}]\"',NULL,NULL),(3,2,16,'dsada','sdasd','\"[{\\\"id\\\": 1, \\\"nombre\\\": \\\"Documentos Legales\\\"}, {\\\"id\\\": 2, \\\"nombre\\\": \\\"Documentos T\\\\u00e9cnicos\\\"}]\"','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Iosef\\\"}]\"',NULL,NULL),(4,2,8,'adsasd','sadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsd','\"[{\\\"id\\\": 1, \\\"nombre\\\": \\\"Documentos Legales\\\"}]\"','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Iosef\\\"}]\"',NULL,NULL);


-- =====================================================
-- RESTAURAR CONFIGURACIÓN
-- =====================================================
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;
