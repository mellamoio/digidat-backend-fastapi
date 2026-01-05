import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaChevronRight, FaUpload, FaEye } from "react-icons/fa";
import type { Obra } from "../../types/obra";
import type { ActividadEtapa } from "../../types/actividad_etapa";
import type { EstadoEtapa } from "../../types/estado_etapa";
import InformacionFinancista from "./InformacionFinancista";
import InformacionContratista from "./InformacionContratista";
import Pagos from "./Pagos";
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
  SeccionHeader,
  IconoFlecha,
  SeccionContent
} from "./index.styled";
import { DataTableCustom } from "../../components/DataTableCustom";
import { ProgressBar } from "../../components/ui/data-display/ProgressBar/ProgressBar";
import type { TableColumn } from "react-data-table-component";
import ModalObra from "../../components/ui/feedback/Modal/ModalObra";
import ModalEliminar from "../../components/ui/feedback/Modal/ModalEliminar";
import BotonReturn from "../../components/ui/Buttons/BotonReturn";
import { Header as HeaderComponent } from "../../components/ui/layout/Container/Header";
import dayjs from "dayjs";
import { message } from "antd";
import { getObraById, deleteObra } from "../../services/getObra.service";
import { getEstadosEtapa } from "../../services/getEstadoEtapa.service";
import { 
  getActividadesEtapa, 
  deleteActividadEtapa,
  inicializarActividadesObra 
} from "../../services/getActividadEtapa.service";


export const Detalles: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const obraId = Number(id);
  const navigate = useNavigate();


  const [selectedMenu, setSelectedMenu] = useState<string>("Etapas y Ejecución");
  const [obra, setObra] = useState<Obra | null>(null);
  const [estados, setEstados] = useState<EstadoEtapa[]>([]);
  const [actividades, setActividades] = useState<ActividadEtapa[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [inicializando, setInicializando] = useState(false);


  const [paginacion, setPaginacion] = useState<{ [key: number]: { page: number; perPage: number } }>({});


  useEffect(() => {
    if (obraId) {
      fetchData();
    }
  }, [obraId]);


  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchObra(),
        fetchEstados(),
        fetchActividades()
      ]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      message.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };


  const fetchObra = async () => {
    try {
      const obraData = await getObraById(obraId);
      setObra(obraData);
    } catch (error) {
      console.error("Error al cargar la obra:", error);
      message.error("Error al cargar la obra");
    }
  };


  const fetchEstados = async () => {
    try {
      const estadosData = await getEstadosEtapa();
      setEstados(estadosData);
      
      const initialPagination = estadosData.reduce((acc, estado) => {
        acc[estado.id] = { page: 1, perPage: 10 };
        return acc;
      }, {} as { [key: number]: { page: number; perPage: number } });
      setPaginacion(initialPagination);
    } catch (error) {
      console.error("Error al cargar estados:", error);
      message.error("Error al cargar los estados de etapa");
    }
  };


  const fetchActividades = async () => {
    try {
      const actividadesData = await getActividadesEtapa({ id_obra: obraId });
      setActividades(actividadesData);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
      message.error("Error al cargar las actividades");
    }
  };


  const handleInicializarActividades = async () => {
    setInicializando(true);
    try {
      const result = await inicializarActividadesObra(obraId);
      message.success(result.message);
      await fetchActividades();
    } catch (error: any) {
      message.error(error.message || "Error al inicializar actividades");
    } finally {
      setInicializando(false);
    }
  };


  const toggleSeccion = (estadoId: number) => {
    setSeccionesAbiertas(prev => ({
      ...prev,
      [estadoId]: !prev[estadoId]
    }));
  };


  const handlePageChange = (estadoId: number, page: number) => {
    setPaginacion(prev => ({
      ...prev,
      [estadoId]: { ...prev[estadoId], page }
    }));
  };


  const handleRowsPerPageChange = (estadoId: number, newPerPage: number) => {
    setPaginacion(prev => ({
      ...prev,
      [estadoId]: { page: 1, perPage: newPerPage }
    }));
  };


  const handleEditActividad = (actividad: ActividadEtapa) => {
    message.info(`Editar actividad: ${actividad.nombre_etapa}`);
  };


  const handleDeleteActividad = async (actividad: ActividadEtapa) => {
    try {
      await deleteActividadEtapa(actividad.id_etapa);
      message.success("Actividad eliminada correctamente");
      await fetchActividades();
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      message.error("Error al eliminar la actividad");
    }
  };


  const handleUploadDocument = (actividad: ActividadEtapa) => {
    message.info(`Subir documento para: ${actividad.nombre_etapa}`);
  };


  const handleViewDocument = (actividad: ActividadEtapa) => {
    message.info(`Ver documentos de: ${actividad.nombre_etapa}`);
  };


  const columns: TableColumn<ActividadEtapa>[] = [
    {
      name: "Sec.",
      selector: (row) => row.orden,
      sortable: true,
      width: "80px",
      center: true,
    },
    {
      name: "Actividad",
      selector: (row) => row.nombre_etapa,
      sortable: true,
      grow: 2,
    },
    {
      name: "Comentarios",
      cell: (row: ActividadEtapa) => (
        <div style={{ 
          padding: '8px 0',
          whiteSpace: 'pre-line',
          lineHeight: '1.5',
          maxHeight: '100px',
          overflowY: 'auto',
          fontSize: '13px',
          color: '#333'
        }}>
          {row.comentarios || 'Sin comentarios'}
        </div>
      ),
      sortable: false,
      grow: 3,
      wrap: true,
    },
    {
      name: "Documentos",
      center: true,
      width: "120px",
      cell: (row: ActividadEtapa) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => handleUploadDocument(row)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
              color: '#595959'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.color = '#52c41a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#595959';
            }}
            title="Subir documento"
          >
            <FaUpload size={14} />
          </button>
          <button
            onClick={() => handleViewDocument(row)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
              color: '#595959'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.color = '#722AE9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#595959';
            }}
            title="Ver documentos"
          >
            <FaEye size={14} />
          </button>
        </div>
      ),
    },
  ];


  const getActividadesPorEstado = (estadoId: number) => {
    return actividades.filter(act => act.id_estado_etapa === estadoId);
  };


  const calcularProgresoTotal = () => {
    if (actividades.length === 0) return 0;
    const actividadesConDocumento = actividades.filter(act => act.tiene_documento).length;
    return Math.round((actividadesConDocumento / actividades.length) * 100);
  };


  const handleEditClick = () => setEditModalVisible(true);


  const handleUpdateObra = (updatedObra?: Obra) => {
    if (updatedObra) {
      setObra(updatedObra);
      fetchActividades();
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


  const nombreEtapa =
    estados.find((e) => e.id === obra.estado_id)?.nombre || "N/A";


  const progresoTotal = calcularProgresoTotal();


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
            <strong>Etapa:</strong> {nombreEtapa}
          </p>
          <p style={{ color: "#868686" }}>
            <strong>Fecha de Entrega:</strong> {fechaEntregaFormateada}
          </p>
          
          {/* ✅ MENÚ CON LAS 4 PESTAÑAS */}
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
          {selectedMenu === "Etapas y Ejecución" && obra?.id_obra ? (
            <div>
              <ProgressBar value={progresoTotal} />
              {actividades.length === 0 && (
                <button 
                  onClick={handleInicializarActividades}
                  disabled={inicializando}
                  style={{
                    padding: '10px 20px',
                    background: inicializando ? '#ccc' : '#722AE9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: inicializando ? 'not-allowed' : 'pointer',
                    marginBottom: '20px',
                    fontWeight: '600'
                  }}
                >
                  {inicializando ? 'Inicializando...' : 'Inicializar Actividades de Etapa'}
                </button>
              )}

              {estados
                .sort((a, b) => a.orden - b.orden)
                .map((estado) => {
                  const actividadesEstado = getActividadesPorEstado(estado.id);
                  const paginacionEstado = paginacion[estado.id] || { page: 1, perPage: 10 };
                  const isOpen = seccionesAbiertas[estado.id] || false;

                  return (
                    <div key={estado.id} style={{ marginBottom: "20px" }}>
                      <SeccionHeader onClick={() => toggleSeccion(estado.id)}>
                        <IconoFlecha abierto={isOpen}>
                          <FaChevronRight />
                        </IconoFlecha>
                        <span style={{ color: estado.color, fontWeight: "bold" }}>
                          {estado.nombre}
                        </span>
                        <span style={{ marginLeft: "10px", color: "#868686" }}>
                          ({actividadesEstado.length} actividades)
                        </span>
                      </SeccionHeader>
                      {isOpen && (
                        <SeccionContent>
                          <DataTableCustom
                            title=""
                            columns={columns}
                            data={actividadesEstado}
                            totalRows={actividadesEstado.length}
                            currentPage={paginacionEstado.page}
                            rowsPerPage={paginacionEstado.perPage}
                            onPageChange={(page) => handlePageChange(estado.id, page)}
                            onRowsPerPageChange={(newPerPage) =>
                              handleRowsPerPageChange(estado.id, newPerPage)
                            }
                            onEdit={handleEditActividad}
                            onDelete={handleDeleteActividad}
                            emptyText="No hay actividades en esta etapa"
                          />
                        </SeccionContent>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : selectedMenu === "Información Financista" && obra ? (
            <InformacionFinancista id_obra_impuesto={obra.id_obra} />
          ) : selectedMenu === "Información Contratista" && obra ? (
            <InformacionContratista id_obra_impuesto={obra.id_obra} />
          ) : selectedMenu === "Pagos" && obra ? (
            <Pagos id_obra={obra.id_obra} />
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
      </DetallesLayout>
    </div>
  );
};


export default Detalles;