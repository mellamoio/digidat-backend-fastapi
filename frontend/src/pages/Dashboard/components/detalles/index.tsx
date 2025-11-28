import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Obra } from "../../../../types/obra";
import {
  DetallesContainer,
  Header,
  HeaderLeft,
  Title,
  IconButton,
  Menu,
  MenuItem,
  ContentPlaceholder,
} from "./index.styled";
import EtapasEjecucion from "../detalles/EtapasEjecucion";
import type { Pestaña } from "../../../../types/pestaña";
import type { EstadoEtapa } from "../../../../types/estado_etapa";
import ModalObra from "../../../../components/ui/feedback/Modal/ModalObra";
import ModalEliminar from "../../../../components/ui/feedback/Modal/ModalEliminar";
import BotonReturn from "../../../../components/ui/Buttons/BotonReturn";
import dayjs from "dayjs";
import { message } from "antd";

export const Detalles: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const obraId = Number(id);
  const navigate = useNavigate();

  const mockPestanas: Pestaña[] = [
    { id: 1, name: "Etapas y Ejecución", habilitardeshabilitar: 1 },
    { id: 2, name: "Otra Pestaña", habilitardeshabilitar: 0 },
  ];

  const mockEstados: EstadoEtapa[] = [
    { id: 1, nombre: "En progreso", orden: 1, color: "#E3BD16" },
    { id: 2, nombre: "Finalizado", orden: 2, color: "#4CAF50" },
  ];

  const mockObra: Obra = {
    id_obra: obraId,
    nombre: "Obra de prueba",
    tipo_id: 1,
    estado_id: 1,
    costo_proyecto: 1200000,
    fecha_inicio: "2025-12-01",
    fecha_fin: "2025-12-31",
    id_responsable: 1,
    id_empresa: 1,
    centros_operacion: [{ id: 1, nombre: "Centro Lima" }],
    monto_recuperado: 400000,
    monto_pagado: 300000,
  };

  const [selectedMenu, setSelectedMenu] = useState<string>("Etapas y Ejecución");
  const [pestañas] = useState<Pestaña[]>(mockPestanas);
  const [obra, setObra] = useState<Obra | null>(mockObra);
  const [estados] = useState<EstadoEtapa[]>(mockEstados);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleMenuClick = (menu: string) => {
    if (menu === "Etapas y Ejecución") {
      setSelectedMenu(menu);
      setSelectedId(null);
      return;
    }
    const pestaña = pestañas.find((p) => p.name === menu);
    if (pestaña && pestaña.habilitardeshabilitar === 1) {
      setSelectedMenu(menu);
    }
  };

  const normalizeString = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const menuItems = ["Etapas y Ejecución"].concat(
    pestañas
      .filter(
        (pestaña) =>
          pestaña.habilitardeshabilitar === 1 &&
          normalizeString(pestaña.name) !== normalizeString("Etapas y Ejecución")
      )
      .map((pestaña) => pestaña.name)
  );

  const handleEditClick = () => setEditModalVisible(true);

  const handleUpdateObra = (updatedObra?: Obra) => {
    if (updatedObra) setObra(updatedObra);
    setEditModalVisible(false);
  };

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleDeleteObra = async () => {
    if (!obra?.id_obra) {
      message.error("No se puede eliminar: ID no encontrado");
      return;
    }
    try {
      setShowDeleteModal(false);
      navigate("/dashboard");
    } catch (error) {
      message.error("Error al eliminar la obra");
    }
  };

  if (!obra) {
    return (
      <DetallesContainer>
        <Header>
          <HeaderLeft>
            <BotonReturn />
            <Title>Obra no encontrada</Title>
          </HeaderLeft>
        </Header>
        <p>No se encontró una obra con el ID especificado.</p>
      </DetallesContainer>
    );
  }

  const fechaEntregaFormateada = obra.fecha_fin
    ? dayjs(obra.fecha_fin).format("DD/MM/YYYY")
    : "N/A";

  const nombreEtapa =
    estados.find((e) => e.id === obra.estado_id)?.nombre || "N/A";

  return (
    <DetallesContainer>
      <Header>
        <HeaderLeft>
          <BotonReturn />
          <Title>{obra.nombre}</Title>
          <IconButton onClick={handleEditClick}>
            <FaEdit fill="white" />
          </IconButton>
          <IconButton onClick={handleDeleteClick}>
            <FaTrash fill="white" />
          </IconButton>
        </HeaderLeft>
      </Header>
      <p style={{ color: "#868686" }}>
        <strong>Etapa:</strong> {nombreEtapa}
      </p>
      <p style={{ color: "#868686" }}>
        <strong>Fecha de Entrega:</strong> {fechaEntregaFormateada}
      </p>
      <Menu>
        {menuItems.map((item, index) => (
          <MenuItem
            key={`${item}-${index}`}
            onClick={() => handleMenuClick(item)}
            active={selectedMenu === item}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
      <ContentPlaceholder>
        {selectedMenu === "Etapas y Ejecución" && obra?.id_obra ? (
          <EtapasEjecucion />
        ) : (
          <p>{selectedMenu || "Selecciona una pestaña"}</p>
        )}
      </ContentPlaceholder>
      {editModalVisible && (
        <ModalObra
          isOpen={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSuccess={handleUpdateObra}
          initialData={obra}
        />
      )}
      {showDeleteModal && (
        <ModalEliminar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteObra}
          mensaje="¿Estás seguro de eliminar esta obra?"
        />
      )}
    </DetallesContainer>
  );
};

export default Detalles;