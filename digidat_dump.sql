-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: digidat
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actividades_etapa`
--

DROP TABLE IF EXISTS `actividades_etapa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades_etapa` (
  `id_etapa` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `nombre_etapa` varchar(100) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_estado_etapa` int NOT NULL,
  PRIMARY KEY (`id_etapa`),
  KEY `id_obra` (`id_obra`),
  KEY `fk_estado_etapa` (`id_estado_etapa`),
  CONSTRAINT `actividades_etapa_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `fk_estado_etapa` FOREIGN KEY (`id_estado_etapa`) REFERENCES `estados_etapa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades_etapa`
--

LOCK TABLES `actividades_etapa` WRITE;
/*!40000 ALTER TABLE `actividades_etapa` DISABLE KEYS */;
/*!40000 ALTER TABLE `actividades_etapa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(100) NOT NULL,
  `id_registro` int NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,'obras',1,'INSERT','root@localhost','2025-10-15 16:55:47'),(2,'pagos',1,'INSERT','root@localhost','2025-10-15 16:55:47'),(3,'obras',2,'INSERT','root@172.18.0.1','2025-11-19 21:54:52'),(4,'obras',2,'DELETE','root@localhost','2025-11-19 22:25:02'),(5,'obras',3,'INSERT','root@172.18.0.1','2025-11-19 23:33:30'),(6,'obras',4,'INSERT','root@172.18.0.1','2025-11-19 23:35:39'),(7,'obras',5,'INSERT','root@172.18.0.1','2025-11-19 23:42:40'),(8,'obras',6,'INSERT','digidat_user@172.18.0.1','2025-11-20 14:46:15'),(9,'obras',7,'INSERT','digidat_user@172.18.0.1','2025-11-26 00:09:25'),(10,'obras',8,'INSERT','digidat_user@172.18.0.1','2025-11-26 00:10:05'),(11,'obras',9,'INSERT','digidat_user@172.18.0.1','2025-11-26 00:41:19'),(12,'obras',1,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:11'),(13,'obras',3,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:33'),(14,'obras',4,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:35'),(15,'obras',5,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:36'),(16,'obras',6,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:38'),(17,'obras',7,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:39'),(18,'obras',8,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:40'),(19,'obras',9,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:41'),(20,'obras',10,'INSERT','digidat_user@172.18.0.1','2025-11-26 01:05:10'),(21,'obras',10,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:09:14'),(22,'obras',1,'INSERT','digidat_user@172.18.0.1','2025-11-26 01:09:54');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beneficiarios`
--

DROP TABLE IF EXISTS `beneficiarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiarios` (
  `id_beneficiario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `documento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_beneficiario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiarios`
--

LOCK TABLES `beneficiarios` WRITE;
/*!40000 ALTER TABLE `beneficiarios` DISABLE KEYS */;
INSERT INTO `beneficiarios` VALUES (1,'Beneficiario Test','12345678');
/*!40000 ALTER TABLE `beneficiarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `centros_operacion`
--

DROP TABLE IF EXISTS `centros_operacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centros_operacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `centros_operacion`
--

LOCK TABLES `centros_operacion` WRITE;
/*!40000 ALTER TABLE `centros_operacion` DISABLE KEYS */;
INSERT INTO `centros_operacion` VALUES (7,'Centro Arequipa'),(8,'Centro Cusco'),(4,'Centro Este'),(6,'Centro Lima'),(2,'Centro Norte'),(5,'Centro Oeste'),(1,'Centro Principal'),(3,'Centro Sur');
/*!40000 ALTER TABLE `centros_operacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id_documento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ruta` varchar(1000) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `tamano_bytes` int DEFAULT NULL,
  `uploaded_by` int DEFAULT NULL,
  `id_obra` int DEFAULT NULL,
  `id_etapa` int DEFAULT NULL,
  `id_informacionfinancista` int DEFAULT NULL,
  `id_informacioncontratista` int DEFAULT NULL,
  `id_pago` int DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_documento`),
  KEY `idx_documentos_id_obra` (`id_obra`),
  KEY `idx_documentos_id_etapa` (`id_etapa`),
  KEY `idx_documentos_id_infofin` (`id_informacionfinancista`),
  KEY `idx_documentos_id_infocon` (`id_informacioncontratista`),
  KEY `idx_documentos_id_pago` (`id_pago`),
  KEY `idx_documentos_uploaded_by` (`uploaded_by`),
  CONSTRAINT `documentos_fk_etapa` FOREIGN KEY (`id_etapa`) REFERENCES `actividades_etapa` (`id_etapa`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_infocon` FOREIGN KEY (`id_informacioncontratista`) REFERENCES `informacioncontratista` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_infofin` FOREIGN KEY (`id_informacionfinancista`) REFERENCES `informacionfinancista` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_obras` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_pago` FOREIGN KEY (`id_pago`) REFERENCES `pagos` (`id_pago`) ON DELETE SET NULL,
  CONSTRAINT `documentos_fk_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `usuarios` (`id_responsable`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_etapa`
--

DROP TABLE IF EXISTS `estados_etapa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_etapa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `orden` int NOT NULL,
  `color` varchar(20) DEFAULT '#722AE9',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_orden` (`orden`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_etapa`
--

LOCK TABLES `estados_etapa` WRITE;
/*!40000 ALTER TABLE `estados_etapa` DISABLE KEYS */;
INSERT INTO `estados_etapa` VALUES (1,'Priorización',1,'#722AE9'),(2,'Actos Previos',2,'#FFA500'),(3,'Selección',3,'#FFD700'),(4,'Ejecución',4,'#2196F3'),(5,'Emisión de CIPRL o CIPGN',5,'#28A745');
/*!40000 ALTER TABLE `estados_etapa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_obra`
--

DROP TABLE IF EXISTS `estados_obra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_obra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `orden` int NOT NULL,
  `color` varchar(20) DEFAULT '#722AE9',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_orden` (`orden`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_obra`
--

LOCK TABLES `estados_obra` WRITE;
/*!40000 ALTER TABLE `estados_obra` DISABLE KEYS */;
INSERT INTO `estados_obra` VALUES (1,'Priorizacin',1,'#722AE9'),(2,'Actos Previos',2,'#FFA500'),(3,'Seleccin',3,'#FFD700'),(4,'Ejecucin',4,'#2196F3'),(5,'Emisin de CIPRL o CIPGN',5,'#28A745');
/*!40000 ALTER TABLE `estados_obra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_reembolso`
--

DROP TABLE IF EXISTS `estados_reembolso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_reembolso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_reembolso`
--

LOCK TABLES `estados_reembolso` WRITE;
/*!40000 ALTER TABLE `estados_reembolso` DISABLE KEYS */;
INSERT INTO `estados_reembolso` VALUES (2,'No Reembolsado'),(1,'Reembolsado');
/*!40000 ALTER TABLE `estados_reembolso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `informacioncontratista`
--

DROP TABLE IF EXISTS `informacioncontratista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `informacioncontratista` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `detalle` text,
  `id_responsable` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_obra` (`id_obra`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `informacioncontratista_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `informacioncontratista_ibfk_2` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informacioncontratista`
--

LOCK TABLES `informacioncontratista` WRITE;
/*!40000 ALTER TABLE `informacioncontratista` DISABLE KEYS */;
/*!40000 ALTER TABLE `informacioncontratista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `informacionfinancista`
--

DROP TABLE IF EXISTS `informacionfinancista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `informacionfinancista` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `detalle` text,
  `id_responsable` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_obra` (`id_obra`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `informacionfinancista_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `informacionfinancista_ibfk_2` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informacionfinancista`
--

LOCK TABLES `informacionfinancista` WRITE;
/*!40000 ALTER TABLE `informacionfinancista` DISABLE KEYS */;
/*!40000 ALTER TABLE `informacionfinancista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obra_centro_operacion`
--

DROP TABLE IF EXISTS `obra_centro_operacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra_centro_operacion` (
  `id_obra` int NOT NULL,
  `id_centro_operacion` int NOT NULL,
  PRIMARY KEY (`id_obra`,`id_centro_operacion`),
  KEY `fk_oco_centro` (`id_centro_operacion`),
  CONSTRAINT `fk_oco_centro` FOREIGN KEY (`id_centro_operacion`) REFERENCES `centros_operacion` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oco_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obra_centro_operacion`
--

LOCK TABLES `obra_centro_operacion` WRITE;
/*!40000 ALTER TABLE `obra_centro_operacion` DISABLE KEYS */;
INSERT INTO `obra_centro_operacion` VALUES (1,7);
/*!40000 ALTER TABLE `obra_centro_operacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obras`
--

DROP TABLE IF EXISTS `obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo_id` int NOT NULL DEFAULT '1',
  `estado_id` int DEFAULT '1',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `costo_proyecto` float DEFAULT '0',
  `id_responsable` int DEFAULT NULL,
  `id_empresa` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_obra`),
  KEY `id_responsable` (`id_responsable`),
  KEY `fk_obra_estado` (`estado_id`),
  CONSTRAINT `fk_obra_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados_obra` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_obra_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`) ON DELETE SET NULL,
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obras`
--

LOCK TABLES `obras` WRITE;
/*!40000 ALTER TABLE `obras` DISABLE KEYS */;
INSERT INTO `obras` VALUES (1,'Obra 1',9,1,'2025-11-25','2025-11-26',1,2,1);
/*!40000 ALTER TABLE `obras` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `obras_auditoria_insert` AFTER INSERT ON `obras` FOR EACH ROW BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('obras', NEW.id_obra, 'INSERT', USER());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `obras_auditoria_update` AFTER UPDATE ON `obras` FOR EACH ROW BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('obras', NEW.id_obra, 'UPDATE', USER());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `obras_auditoria_delete` AFTER DELETE ON `obras` FOR EACH ROW BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('obras', OLD.id_obra, 'DELETE', USER());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `id_obra` (`id_obra`),
  KEY `id_beneficiario` (`id_beneficiario`),
  KEY `id_tipo_gasto` (`id_tipo_gasto`),
  KEY `id_estado_reembolso` (`id_estado_reembolso`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_beneficiario`) REFERENCES `beneficiarios` (`id_beneficiario`),
  CONSTRAINT `pagos_ibfk_3` FOREIGN KEY (`id_tipo_gasto`) REFERENCES `tipos_gasto` (`id`),
  CONSTRAINT `pagos_ibfk_4` FOREIGN KEY (`id_estado_reembolso`) REFERENCES `estados_reembolso` (`id`),
  CONSTRAINT `pagos_ibfk_5` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `pagos_before_insert` BEFORE INSERT ON `pagos` FOR EACH ROW BEGIN
  IF NEW.id_tipo_gasto = (SELECT id FROM tipos_gasto WHERE nombre = 'Administrativo') THEN
    SET NEW.id_estado_reembolso = (SELECT id FROM estados_reembolso WHERE nombre = 'No Reembolsado');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `pagos_auditoria_insert` AFTER INSERT ON `pagos` FOR EACH ROW BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('pagos', NEW.id_pago, 'INSERT', USER());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `pagos_before_update` BEFORE UPDATE ON `pagos` FOR EACH ROW BEGIN
  IF NEW.id_tipo_gasto = (SELECT id FROM tipos_gasto WHERE nombre = 'Administrativo') THEN
    SET NEW.id_estado_reembolso = (SELECT id FROM estados_reembolso WHERE nombre = 'No Reembolsado');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `pagos_auditoria_update` AFTER UPDATE ON `pagos` FOR EACH ROW BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('pagos', NEW.id_pago, 'UPDATE', USER());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `pagos_auditoria_delete` AFTER DELETE ON `pagos` FOR EACH ROW BEGIN
  INSERT INTO `auditoria` (`tabla_afectada`, `id_registro`, `accion`, `usuario`)
  VALUES ('pagos', OLD.id_pago, 'DELETE', USER());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL,
  `delete_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','Administrador del sistema','2025-09-25 21:23:26',NULL,NULL),(2,'Usuario','Usuario','2025-09-25 21:23:26',NULL,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_gasto`
--

DROP TABLE IF EXISTS `tipos_gasto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_gasto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_gasto`
--

LOCK TABLES `tipos_gasto` WRITE;
/*!40000 ALTER TABLE `tipos_gasto` DISABLE KEYS */;
INSERT INTO `tipos_gasto` VALUES (1,'Administrativo'),(2,'Reembolsable');
/*!40000 ALTER TABLE `tipos_gasto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_obra`
--

DROP TABLE IF EXISTS `tipos_obra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_obra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_obra`
--

LOCK TABLES `tipos_obra` WRITE;
/*!40000 ALTER TABLE `tipos_obra` DISABLE KEYS */;
INSERT INTO `tipos_obra` VALUES (9,'Proyecto de inversión','Proyectos de inversión pública'),(10,'IOARR','Inversión de Reposición y Rehabilitación'),(11,'IOARR de emergencia','IOARR ejecutadas en situaciones de emergencia'),(12,'Operación','Obras de operación y mantenimiento');
/*!40000 ALTER TABLE `tipos_obra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `id_role` (`id_role`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Victor','Administrador del Sistema','admin@test.com','pbkdf2:sha256:1000000$uWWiwb6NCDsexTbx$f084fc8e9a3110e09abf509a4a9f5f089c9177e519b2ca80a19bd8f2253c56bc',1,'ACTIVO'),(2,'Iosef','Analista','iosef@test.com','pbkdf2:sha256:1000000$romb8y2VdncP4V9F$6fbd6b175395b4cf4c6540cc8c805b51a10a558510e426608ff13fd6396fbdb1',2,'ACTIVO'),(3,'Erick','Ingeniero','erick@test.com','pbkdf2:sha256:1000000$c3HbYVSifdfo5fRT$72b87f5a689274476bda452e70d81d0669dee82c01d6876c4c6b237f42f078f8',2,'ACTIVO');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26  4:00:20
