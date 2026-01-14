-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: digidat
-- ------------------------------------------------------
-- Server version	8.0.43

--
-- Table structure for table `actividades_etapa`
--

DROP TABLE IF EXISTS `actividades_etapa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades_etapa` (
  `id_etapa` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `nombre_etapa` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_estado_etapa` int NOT NULL,
  `orden` int DEFAULT '1',
  `comentario_etapa` text,
  PRIMARY KEY (`id_etapa`),
  KEY `id_obra` (`id_obra`),
  KEY `fk_estado_etapa` (`id_estado_etapa`),
  CONSTRAINT `actividades_etapa_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `fk_estado_etapa` FOREIGN KEY (`id_estado_etapa`) REFERENCES `estados_etapa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades_etapa`
--

LOCK TABLES `actividades_etapa` WRITE;
/*!40000 ALTER TABLE `actividades_etapa` DISABLE KEYS */;
INSERT INTO `actividades_etapa` VALUES (102,8,'Aprobar la Ejecución Conjunta de Proyectos','2025-12-19 02:05:06',1,2,NULL),(106,8,'Otorgar la Certificación Presupuestaria y/o compromiso de Priorización de Recursos para Entidades Públicas de Gobierno Nacional','2025-12-19 02:05:06',2,2,NULL),(107,8,'Aprobar las bases para el proceso de selección','2025-12-19 02:05:06',2,3,NULL),(109,8,'Realizar la suscripción de Convenio','2025-12-19 02:05:06',3,2,NULL),(111,8,'Realizar modificación de Estudios','2025-12-19 02:05:06',3,4,NULL),(112,8,'Aprobar el Estudio definitivo, expediente de operación y/o mantenimiento','2025-12-19 02:05:06',3,5,NULL),(113,8,'Aprobar la Sustitución del Ejecutor de Proyecto','2025-12-19 02:05:06',3,6,NULL),(114,8,'Aprobar la ampliación de plazos','2025-12-19 02:05:06',3,7,NULL),(115,8,'Realizar la culminación y recepción del proyecto','2025-12-19 02:05:06',3,8,NULL),(116,8,'Aprobar la liquidación del proyecto','2025-12-19 02:05:06',3,9,NULL),(117,8,'Emitir conformidad de Mantenimiento u Operación','2025-12-19 02:05:06',4,1,NULL),(118,8,'Emitir el CIPRL o CIPGN','2025-12-19 02:05:06',5,1,NULL),(119,8,'Emitir el CIPRA por el CIPGN por Avance de Obra','2025-12-19 02:05:06',5,2,NULL),(139,16,'Aprobar la Capacidad Presupuestal','2026-01-13 21:25:28',1,1,NULL),(140,16,'Aprobar la Ejecución Conjunta de Proyectos','2026-01-13 21:25:28',1,2,NULL),(141,16,'Evaluar la Propuesta de Proyectos del Sector Privado','2026-01-13 21:25:28',1,3,NULL),(142,16,'Aprobar la Lista de Proyectos Priorizados por Entidad Pública','2026-01-13 21:25:28',1,4,NULL),(143,16,'Designar al Comité Especial','2026-01-13 21:25:28',2,1,NULL),(144,16,'Otorgar la Certificación Presupuestaria y/o compromiso de Priorización de Recursos para Entidades Públicas de Gobierno Nacional','2026-01-13 21:25:28',2,2,NULL),(145,16,'Aprobar las bases para el proceso de selección','2026-01-13 21:25:28',2,3,NULL),(146,16,'Realizar el Proceso de Selección','2026-01-13 21:25:28',3,1,NULL),(147,16,'Realizar la suscripción de Convenio','2026-01-13 21:25:28',3,2,NULL),(148,16,'Realizar la suscripción de contrato de la Supervisión del Proyecto','2026-01-13 21:25:28',3,3,NULL),(149,16,'Realizar modificación de Estudios','2026-01-13 21:25:28',3,4,NULL),(150,16,'Aprobar el Estudio definitivo, expediente de operación y/o mantenimiento','2026-01-13 21:25:28',3,5,NULL),(151,16,'Aprobar la Sustitución del Ejecutor de Proyecto','2026-01-13 21:25:28',3,6,NULL),(152,16,'Aprobar la ampliación de plazos','2026-01-13 21:25:28',3,7,NULL),(153,16,'Realizar la culminación y recepción del proyecto','2026-01-13 21:25:28',3,8,NULL),(154,16,'Aprobar la liquidación del proyecto','2026-01-13 21:25:28',3,9,NULL),(155,16,'Emitir conformidad de Mantenimiento u Operación','2026-01-13 21:25:28',4,1,NULL),(156,16,'Emitir el CIPRL o CIPGN','2026-01-13 21:25:28',5,1,NULL),(157,16,'Emitir el CIPRA por el CIPGN por Avance de Obra','2026-01-13 21:25:28',5,2,NULL),(158,17,'Aprobar la Capacidad Presupuestal','2026-01-14 01:36:35',1,1,NULL),(159,17,'Aprobar la Ejecución Conjunta de Proyectos','2026-01-14 01:36:35',1,2,NULL),(160,17,'Evaluar la Propuesta de Proyectos del Sector Privado','2026-01-14 01:36:35',1,3,NULL),(161,17,'Aprobar la Lista de Proyectos Priorizados por Entidad Pública','2026-01-14 01:36:35',1,4,NULL),(162,17,'Designar al Comité Especial','2026-01-14 01:36:35',2,1,NULL),(163,17,'Otorgar la Certificación Presupuestaria y/o compromiso de Priorización de Recursos para Entidades Públicas de Gobierno Nacional','2026-01-14 01:36:35',2,2,NULL),(164,17,'Aprobar las bases para el proceso de selección','2026-01-14 01:36:35',2,3,NULL),(165,17,'Realizar el Proceso de Selección','2026-01-14 01:36:35',3,1,NULL),(166,17,'Realizar la suscripción de Convenio','2026-01-14 01:36:35',3,2,NULL),(167,17,'Realizar la suscripción de contrato de la Supervisión del Proyecto','2026-01-14 01:36:35',3,3,NULL),(168,17,'Realizar modificación de Estudios','2026-01-14 01:36:35',3,4,NULL),(169,17,'Aprobar el Estudio definitivo, expediente de operación y/o mantenimiento','2026-01-14 01:36:35',3,5,NULL),(170,17,'Aprobar la Sustitución del Ejecutor de Proyecto','2026-01-14 01:36:35',3,6,NULL),(171,17,'Aprobar la ampliación de plazos','2026-01-14 01:36:35',3,7,NULL),(172,17,'Realizar la culminación y recepción del proyecto','2026-01-14 01:36:35',3,8,NULL),(173,17,'Aprobar la liquidación del proyecto','2026-01-14 01:36:35',3,9,NULL),(174,17,'Emitir conformidad de Mantenimiento u Operación','2026-01-14 01:36:35',4,1,NULL),(175,17,'Emitir el CIPRL o CIPGN','2026-01-14 01:36:35',5,1,NULL),(176,17,'Emitir el CIPRA por el CIPGN por Avance de Obra','2026-01-14 01:36:35',5,2,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,'obras',1,'INSERT','root@localhost','2025-10-15 16:55:47'),(2,'pagos',1,'INSERT','root@localhost','2025-10-15 16:55:47'),(3,'obras',2,'INSERT','root@172.18.0.1','2025-11-19 21:54:52'),(4,'obras',2,'DELETE','root@localhost','2025-11-19 22:25:02'),(5,'obras',3,'INSERT','root@172.18.0.1','2025-11-19 23:33:30'),(6,'obras',4,'INSERT','root@172.18.0.1','2025-11-19 23:35:39'),(7,'obras',5,'INSERT','root@172.18.0.1','2025-11-19 23:42:40'),(8,'obras',6,'INSERT','digidat_user@172.18.0.1','2025-11-20 14:46:15'),(9,'obras',7,'INSERT','digidat_user@172.18.0.1','2025-11-26 00:09:25'),(10,'obras',8,'INSERT','digidat_user@172.18.0.1','2025-11-26 00:10:05'),(11,'obras',9,'INSERT','digidat_user@172.18.0.1','2025-11-26 00:41:19'),(12,'obras',1,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:11'),(13,'obras',3,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:33'),(14,'obras',4,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:35'),(15,'obras',5,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:36'),(16,'obras',6,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:38'),(17,'obras',7,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:39'),(18,'obras',8,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:40'),(19,'obras',9,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:04:41'),(20,'obras',10,'INSERT','digidat_user@172.18.0.1','2025-11-26 01:05:10'),(21,'obras',10,'DELETE','digidat_user@172.18.0.1','2025-11-26 01:09:14'),(22,'obras',1,'INSERT','digidat_user@172.18.0.1','2025-11-26 01:09:54'),(23,'obras',2,'INSERT','digidat_user@172.18.0.1','2025-11-26 18:24:53'),(24,'obras',3,'INSERT','digidat_user@172.18.0.1','2025-11-26 18:46:54'),(25,'obras',4,'INSERT','digidat_user@172.18.0.1','2025-11-28 01:09:30'),(26,'obras',1,'DELETE','digidat_user@172.18.0.1','2025-11-28 02:39:18'),(27,'obras',4,'DELETE','digidat_user@172.18.0.1','2025-11-28 02:39:54'),(28,'obras',3,'DELETE','digidat_user@172.18.0.1','2025-11-28 02:39:57'),(29,'obras',2,'DELETE','digidat_user@172.18.0.1','2025-11-28 02:39:59'),(30,'obras',5,'INSERT','digidat_user@172.18.0.1','2025-11-28 02:40:11'),(31,'obras',6,'INSERT','digidat_user@172.18.0.1','2025-11-28 02:43:42'),(32,'obras',6,'DELETE','digidat_user@172.18.0.1','2025-11-28 02:46:34'),(33,'obras',5,'DELETE','digidat_user@172.18.0.1','2025-11-28 02:46:37'),(34,'obras',7,'INSERT','digidat_user@172.18.0.1','2025-11-28 02:46:51'),(35,'obras',8,'INSERT','digidat_user@172.18.0.1','2025-12-19 02:05:06'),(36,'obras',9,'INSERT','digidat_user@172.18.0.1','2025-12-19 03:09:08'),(37,'obras',7,'DELETE','digidat_user@172.18.0.1','2026-01-04 22:02:56'),(38,'obras',9,'DELETE','digidat_user@172.18.0.1','2026-01-04 22:03:00'),(39,'obras',10,'INSERT','digidat_user@172.18.0.1','2026-01-04 22:03:17'),(40,'obras',11,'INSERT','digidat_user@172.18.0.1','2026-01-04 22:03:27'),(41,'obras',12,'INSERT','digidat_user@172.18.0.1','2026-01-04 22:03:28'),(42,'obras',13,'INSERT','digidat_user@172.18.0.1','2026-01-04 22:03:57'),(43,'obras',10,'DELETE','digidat_user@172.18.0.1','2026-01-04 22:13:56'),(44,'obras',11,'DELETE','digidat_user@172.18.0.1','2026-01-04 22:13:59'),(45,'obras',12,'DELETE','digidat_user@172.18.0.1','2026-01-04 22:14:02'),(46,'obras',13,'DELETE','digidat_user@172.18.0.1','2026-01-04 22:14:06'),(49,'pagos',2,'INSERT','digidat_user@172.18.0.1','2026-01-13 20:45:07'),(50,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:45:18'),(51,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:45:58'),(52,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:13'),(53,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:40'),(54,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:43'),(55,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:46'),(56,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:50'),(57,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:52'),(58,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:54'),(59,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-13 20:54:58'),(60,'obras',16,'INSERT','digidat_user@172.18.0.1','2026-01-13 21:25:28'),(61,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-14 00:36:11'),(62,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-14 00:36:20'),(63,'pagos',2,'UPDATE','digidat_user@172.18.0.1','2026-01-14 00:36:27'),(64,'obras',17,'INSERT','digidat_user@172.18.0.1','2026-01-14 01:36:35'),(65,'pagos',3,'INSERT','digidat_user@172.18.0.1','2026-01-14 02:43:12'),(66,'pagos',3,'UPDATE','digidat_user@172.18.0.1','2026-01-14 02:43:27');
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiarios`
--

LOCK TABLES `beneficiarios` WRITE;
/*!40000 ALTER TABLE `beneficiarios` DISABLE KEYS */;
INSERT INTO `beneficiarios` VALUES (2,'Comunidad Campesina de Cabanaconde - Arequipa',NULL),(3,'AA.HH. Alto Selva Alegre - Arequipa',NULL),(4,'Pueblo Joven Jos Carlos Maritegui - Arequipa',NULL),(5,'Comunidad Campesina de Chinchero - Cusco',NULL),(6,'Comunidad de Pisac - Cusco',NULL),(7,'AA.HH. Santiago - Cusco',NULL),(8,'AA.HH. Huaycn - Lima Este',NULL),(9,'Distrito de Ate Vitarte - Lima Este',NULL),(10,'Comunidad de Santa Mara de Huachipa - Lima Este',NULL),(11,'Distrito de San Juan de Lurigancho - Lima',NULL),(12,'AA.HH. Pamplona Alta - Lima',NULL),(13,'Pueblo Joven Canto Grande - Lima',NULL),(14,'Distrito de Comas - Lima Norte',NULL),(15,'AA.HH. Los Olivos - Lima Norte',NULL),(16,'Pueblo Joven Independencia - Lima Norte',NULL),(17,'AA.HH. Pachactec - Callao',NULL),(18,'Distrito de Ventanilla - Callao',NULL),(19,'Comunidad de Mi Per - Callao',NULL),(20,'Distrito Central de Lima',NULL),(21,'Comunidad de Barrios Altos - Lima Centro',NULL),(22,'AA.HH. Villa Mara del Triunfo - Lima Sur',NULL),(23,'Distrito de Villa El Salvador - Lima Sur',NULL),(24,'Pueblo Joven San Juan de Miraflores - Lima Sur',NULL);
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
  `id_tipo_contratista` int NOT NULL DEFAULT '1',
  `id_obra` int NOT NULL,
  `aspecto` text NOT NULL,
  `comentarios` text,
  `id_categoria_documento` json DEFAULT NULL,
  `responsables` json DEFAULT NULL,
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
  `id_tipo_financista` int NOT NULL DEFAULT '1',
  `id_obra` int NOT NULL,
  `aspecto` text NOT NULL,
  `comentarios` text,
  `id_categoria_documento` json DEFAULT NULL,
  `responsables` json DEFAULT NULL,
  `detalle` text,
  `id_responsable` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_obra` (`id_obra`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `informacionfinancista_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `informacionfinancista_ibfk_2` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_responsable`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informacionfinancista`
--

LOCK TABLES `informacionfinancista` WRITE;
/*!40000 ALTER TABLE `informacionfinancista` DISABLE KEYS */;
INSERT INTO `informacionfinancista` VALUES (2,1,16,'dsadfd','saddasds','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Documentos T\\\\u00e9cnicos\\\"}]\"','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Iosef\\\"}]\"',NULL,NULL),(3,2,16,'dsada','sdasd','\"[{\\\"id\\\": 1, \\\"nombre\\\": \\\"Documentos Legales\\\"}, {\\\"id\\\": 2, \\\"nombre\\\": \\\"Documentos T\\\\u00e9cnicos\\\"}]\"','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Iosef\\\"}]\"',NULL,NULL),(4,2,8,'adsasd','sadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsdsadsd','\"[{\\\"id\\\": 1, \\\"nombre\\\": \\\"Documentos Legales\\\"}]\"','\"[{\\\"id\\\": 2, \\\"nombre\\\": \\\"Iosef\\\"}]\"',NULL,NULL);
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
INSERT INTO `obra_centro_operacion` VALUES (17,1),(17,2),(17,3),(17,4),(17,5),(8,6),(17,6),(17,7),(16,8),(17,8);
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obras`
--

LOCK TABLES `obras` WRITE;
/*!40000 ALTER TABLE `obras` DISABLE KEYS */;
INSERT INTO `obras` VALUES (8,'obra 2',10,1,'2025-12-18','2025-12-31',129,2,1),(16,'dsada',10,1,'2026-01-13','2026-01-22',12222,1,1),(17,'111',9,1,'2026-01-13','2026-01-15',1000,2,1);
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
  `monto_pagado` decimal(15,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `id_tipo_gasto` int NOT NULL,
  `es_reembolsable` tinyint(1) NOT NULL DEFAULT '0',
  `id_estado_reembolso` int NOT NULL,
  `id_responsable` int DEFAULT NULL,
  `concepto` varchar(255) NOT NULL DEFAULT '',
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (2,8,5,12.00,'2026-01-13',2,1,2,3,'pago 1'),(3,8,5,1.00,'2026-01-13',2,1,2,3,'1');
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `validar_reembolsable_antes_insert` BEFORE INSERT ON `pagos` FOR EACH ROW BEGIN
    DECLARE tipo_nombre VARCHAR(100);
    
    SELECT nombre INTO tipo_nombre 
    FROM tipos_gasto 
    WHERE id = NEW.id_tipo_gasto;
    
    IF tipo_nombre = 'Administrativo' AND NEW.es_reembolsable = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un gasto administrativo no puede ser reembolsable';
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `validar_reembolsable_antes_update` BEFORE UPDATE ON `pagos` FOR EACH ROW BEGIN
    DECLARE tipo_nombre VARCHAR(100);
    
    SELECT nombre INTO tipo_nombre 
    FROM tipos_gasto 
    WHERE id = NEW.id_tipo_gasto;
    
    IF tipo_nombre = 'Administrativo' AND NEW.es_reembolsable = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un gasto administrativo no puede ser reembolsable';
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

-- Dump completed on 2026-01-14  3:28:02
