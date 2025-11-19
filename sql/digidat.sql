CREATE DATABASE IF NOT EXISTS digidat;
USE digidat;

<<<<<<< HEAD
--
-- Table structure for table `roles`
--
=======
-- ========================================
-- 1️⃣ ROLES
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL,
  `delete_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_role`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `usuarios`
--
=======
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 2️⃣ USUARIOS
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_responsable` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `cargo` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `contrasena_hash` varchar(255) DEFAULT NULL,
  `id_role` int DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id_responsable`),
  UNIQUE KEY `correo` (`correo`),
<<<<<<< HEAD
  KEY `id_role` (`id_role`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `beneficiarios`
--
=======
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 3️⃣ BENEFICIARIOS
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `beneficiarios`;
CREATE TABLE `beneficiarios` (
  `id_beneficiario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `documento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_beneficiario`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `obras`
--
=======
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 4️⃣ OBRAS
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `obras`;
CREATE TABLE `obras` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `costo_obra` decimal(15,2) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `id_responsable` int NOT NULL,
  `id_beneficiario` int NOT NULL,
<<<<<<< HEAD
  PRIMARY KEY (`id_obra`),
  KEY `id_responsable` (`id_responsable`),
  KEY `id_beneficiario` (`id_beneficiario`),
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`),
  CONSTRAINT `obras_ibfk_2` FOREIGN KEY (`id_beneficiario`) REFERENCES `beneficiarios` (`id_beneficiario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `etapas_ejecucion`
--
=======
  `delete_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_obra`),
  CONSTRAINT `obras_fk_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`),
  CONSTRAINT `obras_fk_beneficiario` FOREIGN KEY (`id_beneficiario`) REFERENCES `beneficiarios` (`id_beneficiario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 5️⃣ ESTADOS_ETAPA
-- ========================================
DROP TABLE IF EXISTS `estados_etapa`;
CREATE TABLE `estados_etapa` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `uk_nombre_estado` (`nombre_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `estados_etapa` (`nombre_estado`, `descripcion`) VALUES
  ('Priorización', 'Identificación y priorización del proyecto.'),
  ('Actos Previos', 'Preparación administrativa y legal.'),
  ('Selección', 'Proceso de selección del contratista.'),
  ('Ejecución', 'Ejecución física y financiera del proyecto.'),
  ('Emisión de CIPRL o CIPGN', 'Cierre y emisión de certificados.');

-- ========================================
-- 6️⃣ ETAPAS_EJECUCION
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `etapas_ejecucion`;
CREATE TABLE `etapas_ejecucion` (
  `id_etapa` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
<<<<<<< HEAD
  `nombre_etapa` varchar(100) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_etapa`),
  KEY `id_obra` (`id_obra`),
  CONSTRAINT `etapas_ejecucion_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `estados_reembolso`
--
=======
  `id_estado` int DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_etapa`),
  CONSTRAINT `etapas_fk_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `etapas_fk_estado` FOREIGN KEY (`id_estado`) REFERENCES `estados_etapa` (`id_estado`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 7️⃣ ESTADOS_REEMBOLSO
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `estados_reembolso`;
CREATE TABLE `estados_reembolso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `tipos_gasto`
--
=======
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `estados_reembolso` VALUES 
  (1,'Reembolsado'),
  (2,'No Reembolsado');

-- ========================================
-- 8️⃣ TIPOS_GASTO
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `tipos_gasto`;
CREATE TABLE `tipos_gasto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `informacionfinancista`
--
DROP TABLE IF EXISTS `informacionfinancista`;
CREATE TABLE `informacionfinancista` (
=======
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `tipos_gasto` VALUES 
  (1,'Administrativo'),
  (2,'Reembolsable');

-- ========================================
-- 9️⃣ INFORMACION FINANCISTA
-- ========================================
DROP TABLE IF EXISTS `informacion_financista`;
CREATE TABLE `informacion_financista` (
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `detalle` text,
  `id_responsable` int DEFAULT NULL,
  PRIMARY KEY (`id`),
<<<<<<< HEAD
  KEY `id_obra` (`id_obra`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `informacionfinancista_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`),
  CONSTRAINT `informacionfinancista_ibfk_2` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `informacioncontratista`
--
DROP TABLE IF EXISTS `informacioncontratista`;
CREATE TABLE `informacioncontratista` (
=======
  CONSTRAINT `infofin_fk_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`),
  CONSTRAINT `infofin_fk_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 🔟 INFORMACION CONTRATISTA
-- ========================================
DROP TABLE IF EXISTS `informacion_contratista`;
CREATE TABLE `informacion_contratista` (
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `detalle` text,
  `id_responsable` int DEFAULT NULL,
  PRIMARY KEY (`id`),
<<<<<<< HEAD
  KEY `id_obra` (`id_obra`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `informacioncontratista_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`),
  CONSTRAINT `informacioncontratista_ibfk_2` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `pagos`
--
=======
  CONSTRAINT `infocon_fk_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`),
  CONSTRAINT `infocon_fk_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 11️⃣ PAGOS
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `pagos`;
CREATE TABLE `pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `id_beneficiario` int NOT NULL,
  `concepto_pago` varchar(255) NOT NULL,
  `monto_pagado` decimal(15,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `id_tipo_gasto` int NOT NULL,
  `id_estado_reembolso` int NOT NULL,
  `id_responsable` int DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
<<<<<<< HEAD
  KEY `id_obra` (`id_obra`),
  KEY `id_beneficiario` (`id_beneficiario`),
  KEY `id_tipo_gasto` (`id_tipo_gasto`),
  KEY `id_estado_reembolso` (`id_estado_reembolso`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`),
  CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_beneficiario`) REFERENCES `beneficiarios` (`id_beneficiario`),
  CONSTRAINT `pagos_ibfk_3` FOREIGN KEY (`id_tipo_gasto`) REFERENCES `tipos_gasto` (`id`),
  CONSTRAINT `pagos_ibfk_4` FOREIGN KEY (`id_estado_reembolso`) REFERENCES `estados_reembolso` (`id`),
  CONSTRAINT `pagos_ibfk_5` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `auditoria`
--
=======
  CONSTRAINT `pagos_fk_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`),
  CONSTRAINT `pagos_fk_beneficiario` FOREIGN KEY (`id_beneficiario`) REFERENCES `beneficiarios` (`id_beneficiario`),
  CONSTRAINT `pagos_fk_tipogasto` FOREIGN KEY (`id_tipo_gasto`) REFERENCES `tipos_gasto` (`id`),
  CONSTRAINT `pagos_fk_estadoreembolso` FOREIGN KEY (`id_estado_reembolso`) REFERENCES `estados_reembolso` (`id`),
  CONSTRAINT `pagos_fk_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 12️⃣ AUDITORIA
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `auditoria`;
CREATE TABLE `auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(100) NOT NULL,
  `id_registro` int NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

<<<<<<< HEAD
--
-- Table structure for table `documentos`
--
=======
-- ========================================
-- 13️⃣ DOCUMENTOS
-- ========================================
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
DROP TABLE IF EXISTS `documentos`;
CREATE TABLE `documentos` (
  `id_documento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ruta` varchar(1000) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `tamano_bytes` int DEFAULT NULL,
  `uploaded_by` int DEFAULT NULL,
  `id_obra` int DEFAULT NULL,
  `id_etapa` int DEFAULT NULL,
<<<<<<< HEAD
  `id_informacionfinancista` int DEFAULT NULL,
  `id_informacioncontratista` int DEFAULT NULL,
=======
  `id_informacion_financista` int DEFAULT NULL,
  `id_informacion_contratista` int DEFAULT NULL,
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
  `id_pago` int DEFAULT NULL,
  `create_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `delete_date` timestamp NULL,
  PRIMARY KEY (`id_documento`),
<<<<<<< HEAD
  KEY `idx_documentos_id_obra` (`id_obra`),
  KEY `idx_documentos_id_etapa` (`id_etapa`),
  KEY `idx_documentos_id_infofin` (`id_informacionfinancista`),
  KEY `idx_documentos_id_infocon` (`id_informacioncontratista`),
  KEY `idx_documentos_id_pago` (`id_pago`),
  KEY `idx_documentos_uploaded_by` (`uploaded_by`),
  CONSTRAINT `documentos_fk_obras` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_etapa` FOREIGN KEY (`id_etapa`) REFERENCES `etapas_ejecucion` (`id_etapa`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_infofin` FOREIGN KEY (`id_informacionfinancista`) REFERENCES `informacionfinancista` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_infocon` FOREIGN KEY (`id_informacioncontratista`) REFERENCES `informacioncontratista` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_pago` FOREIGN KEY (`id_pago`) REFERENCES `pagos` (`id_pago`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `usuarios` (`id_responsable`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers
--
DELIMITER ;;
CREATE TRIGGER `pagos_auditoria_insert` AFTER INSERT ON `pagos`
FOR EACH ROW
BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
=======
  CONSTRAINT `doc_fk_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE SET NULL,
  CONSTRAINT `doc_fk_etapa` FOREIGN KEY (`id_etapa`) REFERENCES `etapas_ejecucion` (`id_etapa`) ON DELETE SET NULL,
  CONSTRAINT `doc_fk_infofin` FOREIGN KEY (`id_informacion_financista`) REFERENCES `informacion_financista` (`id`) ON DELETE SET NULL,
  CONSTRAINT `doc_fk_infocon` FOREIGN KEY (`id_informacion_contratista`) REFERENCES `informacion_contratista` (`id`) ON DELETE SET NULL,
  CONSTRAINT `doc_fk_pago` FOREIGN KEY (`id_pago`) REFERENCES `pagos` (`id_pago`) ON DELETE SET NULL,
  CONSTRAINT `doc_fk_usuario` FOREIGN KEY (`uploaded_by`) REFERENCES `usuarios` (`id_responsable`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DELIMITER ;;
-- AUDITORIA PARA PAGOS
CREATE TRIGGER `pagos_auditoria_insert` AFTER INSERT ON `pagos`
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
  VALUES ('pagos', NEW.id_pago, 'INSERT', USER());
END;;

CREATE TRIGGER `pagos_auditoria_update` AFTER UPDATE ON `pagos`
FOR EACH ROW
BEGIN
<<<<<<< HEAD
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
=======
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
  VALUES ('pagos', NEW.id_pago, 'UPDATE', USER());
END;;

CREATE TRIGGER `pagos_auditoria_delete` AFTER DELETE ON `pagos`
FOR EACH ROW
BEGIN
<<<<<<< HEAD
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('pagos', OLD.id_pago, 'DELETE', USER());
END;;

CREATE TRIGGER `obras_auditoria_insert` AFTER INSERT ON `obras`
FOR EACH ROW
BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
=======
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
  VALUES ('pagos', OLD.id_pago, 'DELETE', USER());
END;;

-- AUDITORIA PARA OBRAS
CREATE TRIGGER `obras_auditoria_insert` AFTER INSERT ON `obras`
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
  VALUES ('obras', NEW.id_obra, 'INSERT', USER());
END;;

CREATE TRIGGER `obras_auditoria_update` AFTER UPDATE ON `obras`
FOR EACH ROW
BEGIN
<<<<<<< HEAD
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
=======
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
  VALUES ('obras', NEW.id_obra, 'UPDATE', USER());
END;;

CREATE TRIGGER `obras_auditoria_delete` AFTER DELETE ON `obras`
FOR EACH ROW
BEGIN
<<<<<<< HEAD
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('obras', OLD.id_obra, 'DELETE', USER());
END;;

CREATE TRIGGER `pagos_before_insert` BEFORE INSERT ON `pagos`
FOR EACH ROW
BEGIN
  IF NEW.id_tipo_gasto = (SELECT id FROM tipos_gasto WHERE nombre = 'Administrativo') THEN
    SET NEW.id_estado_reembolso = (SELECT id FROM estados_reembolso WHERE nombre = 'No Reembolsado');
  END IF;
END;;

CREATE TRIGGER `pagos_before_update` BEFORE UPDATE ON `pagos`
FOR EACH ROW
BEGIN
  IF NEW.id_tipo_gasto = (SELECT id FROM tipos_gasto WHERE nombre = 'Administrativo') THEN
    SET NEW.id_estado_reembolso = (SELECT id FROM estados_reembolso WHERE nombre = 'No Reembolsado');
  END IF;
END;;
DELIMITER ;

--
-- Dumping data
--
INSERT INTO `roles` VALUES 
  (1,'Administrador','Administrador del sistema','2025-09-25 21:23:26',NULL,NULL),
  (2,'Usuario','Usuario','2025-09-25 21:23:26',NULL,NULL);
=======
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
  VALUES ('obras', OLD.id_obra, 'DELETE', USER());
END;;

-- AUDITORIA PARA ETAPAS_EJECUCION
CREATE TRIGGER `etapas_auditoria_insert` AFTER INSERT ON `etapas_ejecucion`
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
  VALUES ('etapas_ejecucion', NEW.id_etapa, 'INSERT', USER());
END;;

CREATE TRIGGER `etapas_auditoria_update` AFTER UPDATE ON `etapas_ejecucion`
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
  VALUES ('etapas_ejecucion', NEW.id_etapa, 'UPDATE', USER());
END;;

CREATE TRIGGER `etapas_auditoria_delete` AFTER DELETE ON `etapas_ejecucion`
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (tabla_afectada, id_registro, accion, usuario)
  VALUES ('etapas_ejecucion', OLD.id_etapa, 'DELETE', USER());
END;;

DELIMITER ;

-- ========================================
-- 15️⃣ DATOS DE PRUEBA
-- ========================================
INSERT INTO `roles` VALUES 
  (1,'Administrador','Administrador del sistema',NOW(),NULL,NULL),
  (2,'Usuario','Usuario del sistema',NOW(),NULL,NULL);
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5

INSERT INTO `usuarios` VALUES 
  (1,'Administrador Principal','Administrador del Sistema','admin@test.com','pbkdf2:sha256:1000000$uWWiwb6NCDsexTbx$f084fc8e9a3110e09abf509a4a9f5f089c9177e519b2ca80a19bd8f2253c56bc',1,'ACTIVO'),
  (2,'Iosef','Analista','iosef@test.com','pbkdf2:sha256:1000000$romb8y2VdncP4V9F$6fbd6b175395b4cf4c6540cc8c805b51a10a558510e426608ff13fd6396fbdb1',2,'ACTIVO'),
  (3,'Erick','Ingeniero','erick@test.com','pbkdf2:sha256:1000000$c3HbYVSifdfo5fRT$72b87f5a689274476bda452e70d81d0669dee82c01d6876c4c6b237f42f078f8',2,'ACTIVO');

INSERT INTO `beneficiarios` VALUES 
  (1,'Beneficiario Test','12345678');

INSERT INTO `obras` VALUES 
<<<<<<< HEAD
  (1,'Obra Test',10000.00,'2025-10-15','2025-12-31',1,1);

INSERT INTO `etapas_ejecucion` VALUES 
  (1,1,'Priorización','2025-10-15 00:00:00'),
  (2,1,'Actos Previos','2025-10-15 00:00:00'),
  (3,1,'Selección','2025-10-15 00:00:00'),
  (4,1,'Ejecución','2025-10-15 00:00:00'),
  (5,1,'Emisión de CIPRL o CIPGN','2025-10-15 00:00:00');

INSERT INTO `estados_reembolso` VALUES 
  (1,'Reembolsado'),
  (2,'No Reembolsado');

INSERT INTO `tipos_gasto` VALUES 
  (1,'Administrativo'),
  (2,'Reembolsable');

INSERT INTO `informacionfinancista` VALUES 
  (1,1,'Financista Test',1);

INSERT INTO `informacioncontratista` VALUES 
  (1,1,'Contratista Test',1);

INSERT INTO `pagos` VALUES 
  (1,1,1,'Pago inicial',5000.00,'2025-10-15',1,2,1);
=======
  (1,'Obra Test',10000.00,'2025-10-15','2025-12-31',1,1, NULL);

INSERT INTO `etapas_ejecucion` (`id_obra`, `id_estado`, `fecha_registro`)
VALUES 
  (1, (SELECT id_estado FROM estados_etapa WHERE nombre_estado = 'Priorización'), NOW());

INSERT INTO `informacion_financista` VALUES (1,1,'Financista Test',1);
INSERT INTO `informacion_contratista` VALUES (1,1,'Contratista Test',1);
INSERT INTO `pagos` VALUES (1,1,1,'Pago inicial',5000.00,'2025-10-15',1,2,1);
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
