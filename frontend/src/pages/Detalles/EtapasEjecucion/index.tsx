import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaChevronRight, FaUpload, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { message } from "antd";
import type { TableColumn } from "react-data-table-component";
import { DataTableCustom } from "../../../components/DataTableCustom";
import ModalEliminar from "../../../components/ui/feedback/Modal/ModalEliminar";
import ModalDocumento from "../../../components/ui/feedback/Modal/ModalDocumento";
import ModalVistaPrevia from "../../../components/ui/feedback/Modal/ModalVistaPrevia";
import type { ActividadEtapa } from "../../../types/actividad_etapa";
import type { EstadoEtapa } from "../../../types/estado_etapa";
import type { FileObject } from "../../../types/pagos";
import {
  getEstadosEtapa
} from "../../../services/getEstadoEtapa.service";
import {
  getActividadesEtapa,
  deleteActividadEtapa,
  inicializarActividadesObra
} from "../../../services/getActividadEtapa.service";
import {
  obtenerDocumentos,
  obtenerUrlDocumento
} from "../../../services/getDocumentos.service";
import {
  SeccionHeader,
  IconoFlecha,
} from "./index.styled";

interface EtapasEjecucionProps {
  obraId: number;
}

interface ModalState {
  deleteOpen: boolean;
  uploadOpen: boolean;
  previewOpen: boolean;
  selectedActividadId: number | null;
  selectedActividad: ActividadEtapa | null;
  documentos: FileObject[];
}

export const EtapasEjecucion: React.FC<EtapasEjecucionProps> = ({ obraId }) => {
  const [estados, setEstados] = useState<EstadoEtapa[]>([]);
  const [actividades, setActividades] = useState<ActividadEtapa[]>([]);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState<{ [key: number]: boolean }>({});
  const [paginacion, setPaginacion] = useState<{ [key: number]: { page: number; perPage: number } }>({});
  const [inicializando, setInicializando] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    deleteOpen: false,
    uploadOpen: false,
    previewOpen: false,
    selectedActividadId: null,
    selectedActividad: null,
    documentos: [],
  });

  useEffect(() => {
    if (obraId) {
      fetchData();
    }
  }, [obraId]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchEstados(),
        fetchActividades()
      ]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      message.error("Error al cargar los datos");
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

  const handleOpenDeleteModal = (e: React.MouseEvent, actividad: ActividadEtapa) => {
    e.preventDefault();
    e.stopPropagation();
    setModalState({
      ...modalState,
      deleteOpen: true,
      selectedActividadId: actividad.id_etapa,
    });
  };

  const handleCloseDeleteModal = () => {
    setModalState({
      ...modalState,
      deleteOpen: false,
      selectedActividadId: null,
    });
  };

  const handleDeleteActividad = async () => {
    if (!modalState.selectedActividadId) {
      handleCloseDeleteModal();
      return;
    }

    try {
      await deleteActividadEtapa(modalState.selectedActividadId);
      message.success("Actividad eliminada correctamente");
      await fetchActividades();
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      message.error("Error al eliminar la actividad");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleEditActividad = (actividad: ActividadEtapa) => {
    message.info(`Editar actividad: ${actividad.nombre_etapa}`);
  };

  const handleUploadDocument = (e: React.MouseEvent, actividad: ActividadEtapa) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!actividad.id_etapa) {
      message.error("ID de actividad no válido");
      return;
    }

    setModalState({
      ...modalState,
      uploadOpen: true,
      selectedActividad: actividad,
      selectedActividadId: actividad.id_etapa,
    });
  };

  const handleViewDocument = async (e: React.MouseEvent, actividad: ActividadEtapa) => {
    e.preventDefault();
    e.stopPropagation();

    if (!actividad.id_etapa) {
      message.error("ID de actividad no válido");
      return;
    }

    try {
      const documentos = await obtenerDocumentos({ id_etapa: actividad.id_etapa });

      if (documentos.length === 0) {
        message.info("No hay documentos para esta actividad");
        return;
      }

      const documentosConPreview: FileObject[] = [];

      for (const doc of documentos) {
        try {
          const url = await obtenerUrlDocumento(doc.id_documento, 3600);
          
          if (url) {
            documentosConPreview.push({
              id: doc.id_documento.toString(),
              nombre_original: doc.nombre,
              url: url,
              esImagen: doc.mime_type?.startsWith("image/") || false,
              esPDF: doc.mime_type === "application/pdf" || false,
            });
          }
        } catch (error) {
          console.error(`Error obteniendo URL para documento ${doc.id_documento}:`, error);
        }
      }

      if (documentosConPreview.length === 0) {
        message.error("No se pudieron cargar los documentos");
        return;
      }

      setModalState({
        ...modalState,
        previewOpen: true,
        selectedActividad: actividad,
        selectedActividadId: actividad.id_etapa,
        documentos: documentosConPreview,
      });
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      message.error("Error al cargar los documentos");
    }
  };

  const handleCloseUploadModal = () => {
    setModalState({
      ...modalState,
      uploadOpen: false,
      selectedActividad: null,
      selectedActividadId: null,
    });
  };

  const handleClosePreviewModal = () => {
    setModalState({
      ...modalState,
      previewOpen: false,
      selectedActividad: null,
      selectedActividadId: null,
      documentos: [],
    });
  };

  const handleDocumentsSaved = async () => {
    message.success("Documentos guardados exitosamente");
    handleCloseUploadModal();
    await fetchActividades();
  };

  const handleRemoveDocument = async (index: number) => {
    message.info("Función de eliminar documento desde preview");
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
        <div>{row.comentarios || 'Sin comentarios'}</div>
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
            onClick={(e) => handleUploadDocument(e, row)}
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
            title="Subir documento"
          >
            <FaUpload size={16} />
          </button>

          <button
            onClick={(e) => handleViewDocument(e, row)}
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
            title="Ver documentos"
          >
            <FaEye size={16} />
          </button>
        </div>
      ),
    },
    {
      name: "Opciones",
      center: true,
      width: "100px",
      ignoreRowClick: true,
      cell: (row: ActividadEtapa) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditActividad(row);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
            title="Editar"
          >
            <FaEdit size={14} color="#595959" />
          </button>
          <button
            onClick={(e) => handleOpenDeleteModal(e, row)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
            title="Eliminar"
          >
            <FaTrash size={14} color="#595959" />
          </button>
        </div>
      ),
    },
  ];

  const getActividadesPorEstado = (estadoId: number) => {
    return actividades.filter(act => act.id_estado_etapa === estadoId);
  };

  return (
    <>
      {actividades.length === 0 && (
        <button onClick={handleInicializarActividades} disabled={inicializando}>
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
            <div key={estado.id}>
              <SeccionHeader onClick={() => toggleSeccion(estado.id)}>
                <div>
                  {estado.nombre}
                  <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                    ({actividadesEstado.length} actividades)
                  </span>
                </div>
                <IconoFlecha abierto={isOpen}>
                  <FaChevronRight />
                </IconoFlecha>
              </SeccionHeader>
              {isOpen && (
                  <DataTableCustom
                    title=""
                    columns={columns}
                    data={actividadesEstado.slice(
                      (paginacionEstado.page - 1) * paginacionEstado.perPage,
                      paginacionEstado.page * paginacionEstado.perPage
                    )}
                    totalRows={actividadesEstado.length}
                    currentPage={paginacionEstado.page}
                    rowsPerPage={paginacionEstado.perPage}
                    onPageChange={(page) => handlePageChange(estado.id, page)}
                    onRowsPerPageChange={(newPerPage) =>
                      handleRowsPerPageChange(estado.id, newPerPage)
                    }
                    emptyText="No hay actividades en esta etapa"
                  />
              )}
            </div>
          );
        })}

      {/* Modal de eliminación */}
      {modalState.deleteOpen && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseDeleteModal();
            }
          }}
        >
          <ModalEliminar
            isOpen={modalState.deleteOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteActividad}
            mensaje="¿Estás seguro de eliminar esta actividad?"
          />
        </div>,
        document.body
      )}

      {/* Modal de subir documentos */}
      {modalState.uploadOpen && modalState.selectedActividad && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseUploadModal();
            }
          }}
        >
          <ModalDocumento
            categoria="Documentos"
            tipo="actividad"
            id_etapa={modalState.selectedActividadId!}
            id_obra={obraId}
            onClose={handleCloseUploadModal}
            onDocumentsSaved={handleDocumentsSaved}
          />
        </div>,
        document.body
      )}

      {/* Modal de vista previa */}
      {modalState.previewOpen && ReactDOM.createPortal(
        <ModalVistaPrevia
          visible={modalState.previewOpen}
          files={modalState.documentos}
          onClose={handleClosePreviewModal}
          onRemoveFile={handleRemoveDocument}
        />,
        document.body
      )}
    </>
  );
};

export default EtapasEjecucion;
