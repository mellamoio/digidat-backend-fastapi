import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Obra } from "../../types/obra";
import TablaFinancista from "./InformacionFinancista/index";
import InformacionContratista from "./InformacionContratista";
import Pagos from "./Pagos";
import EtapasEjecucion from "./EtapasEjecucion";
import {
  DetallesLayout,
  DetallesContainer,
  Header,
  HeaderLeft,
  Title,
  IconButton,
  Menu,
  MenuItem,
  ContentPlaceholder,
} from "./index.styled";
import ModalObra from "../../components/ui/feedback/Modal/ModalObra";
import ModalEliminar from "../../components/ui/feedback/Modal/ModalEliminar";
import BotonReturn from "../../components/ui/Buttons/BotonReturn";
import { Header as HeaderComponent } from "../../components/ui/layout/Container/Header";
import dayjs from "dayjs";
import { message } from "antd";
import { getObraById, deleteObra } from "../../services/getObra.service";

export const Detalles: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const obraId = Number(id);
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState<string>("Etapas y Ejecución");
  const [obra, setObra] = useState<Obra | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (obraId) {
      fetchObra();
    }
  }, [obraId]);

  const fetchObra = async () => {
    setLoading(true);
    try {
      const obraData = await getObraById(obraId);
      setObra(obraData);
    } catch (error) {
      console.error("Error al cargar la obra:", error);
      message.error("Error al cargar la obra");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => setEditModalVisible(true);

  const handleUpdateObra = (updatedObra?: Obra) => {
    if (updatedObra) {
      setObra(updatedObra);
    }
    setEditModalVisible(false);
  };

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleDeleteObra = async () => {
    if (!obra?.id_obra) {
      message.error("No se puede eliminar: ID no encontrado");
      return;
    }
    try {
      await deleteObra(obra.id_obra);
      message.success("Obra eliminada correctamente");
      setShowDeleteModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al eliminar obra:", error);
      message.error("Error al eliminar la obra");
    }
  };

  if (loading || !obra) {
    return (
      <div className="page-container">
        <HeaderComponent />
        <DetallesLayout>
          <DetallesContainer>
            <Header>
              <HeaderLeft>
                <BotonReturn />
                <Title>Cargando...</Title>
              </HeaderLeft>
            </Header>
          </DetallesContainer>
        </DetallesLayout>
      </div>
    );
  }

  const fechaEntregaFormateada = obra.fecha_fin
    ? dayjs(obra.fecha_fin).format("DD/MM/YYYY")
    : "N/A";

  return (
    <div className="page-container">
      <HeaderComponent />
      <DetallesLayout>
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
            <strong>Fecha de Entrega:</strong> {fechaEntregaFormateada}
          </p>
          
          <Menu>
            <MenuItem
              onClick={() => setSelectedMenu("Etapas y Ejecución")}
              active={selectedMenu === "Etapas y Ejecución"}
            >
              Etapas y Ejecución
            </MenuItem>
            <MenuItem
              onClick={() => setSelectedMenu("Información Financista")}
              active={selectedMenu === "Información Financista"}
            >
              Información Financista
            </MenuItem>
            <MenuItem
              onClick={() => setSelectedMenu("Información Contratista")}
              active={selectedMenu === "Información Contratista"}
            >
              Información Contratista
            </MenuItem>
            <MenuItem
              onClick={() => setSelectedMenu("Pagos")}
              active={selectedMenu === "Pagos"}
            >
              Pagos
            </MenuItem>
          </Menu>

          <ContentPlaceholder>
            {selectedMenu === "Etapas y Ejecución" && obra?.id_obra && (
              <EtapasEjecucion obraId={obra.id_obra} />
            )}
            {selectedMenu === "Información Financista" && obra && (
              <TablaFinancista id_obra={obra.id_obra} />
            )}
            {selectedMenu === "Información Contratista" && obra && (
              <InformacionContratista id_obra={obra.id_obra} />
            )}
            {selectedMenu === "Pagos" && obra && (
              <Pagos id_obra={obra.id_obra} />
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
      </DetallesLayout>
    </div>
  );
};

export default Detalles;
