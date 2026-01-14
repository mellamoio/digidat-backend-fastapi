import { useState, useEffect, useCallback, useRef } from "react";
import type { TableColumn } from "react-data-table-component";
import { Tooltip } from "antd";
import { FaEdit, FaTrash, FaFileUpload } from "react-icons/fa";
import { DataTableCustom } from "../../../components/DataTableCustom";
import FormularioSubirDocumentos from "../../../components/ui/feedback/Modal/ModalDocumento";
import FormularioRequisito, { type CampoFormulario } from "../../../components/ui/feedback/Modal/ModalRequisito";
import ModalEliminar from "../../../components/ui/feedback/Modal/ModalEliminar";
import ModalVistaPrevia from "../../../components/ui/feedback/Modal/ModalVistaPrevia";
import {
  fetchInformacionFinancista,
  sendFinancista,
  deleteFinancista,
} from "../../../services/getInformacionFinancista.service";
import type { 
  FinancistaData,
  FinancistaDataCreate,
  FinancistaEntityData 
} from "../../../types/informacion_financista";
import { useSatelite } from "../../../context/DigidatContext";
import {
  AddButton,
  ModalBackground,
  IconsContainer,
  IconWrapper,
  Container,
  ProgressContainer,
  ProgressLabel,
  ProgressBarStyled,
  ResponsablesContainer,
  ResponsableIcon,
} from "./index.styled";
import { CARPETA_FINANCISTA } from "../../../constants/carpetas";
import type { FileObject } from "../../../types/pagos";
import api from "../../../api/api";
import { usePagination } from "../../../hooks/usePagination";

interface FinancistaFileObject extends FileObject {
  categoria_id?: number | null;
}

interface Financista {
  id: number;
  tipo: string;
  id_tipo_financista: number;
  aspecto: string;
  comentarios: string;
  documentos: FinancistaFileObject[];
  responsables: { id: string; nombre: string }[];
  categorias: { id: string; nombre: string }[];
  id_obra: number;
}

interface TablaFinancistaProps {
  id_obra: number;
}

const tipoFinancistaOptions = [
  { value: "1", label: "Requisito Legal" },
  { value: "2", label: "Información Financiera" },
];

const TablaFinancista: React.FC<TablaFinancistaProps> = ({ id_obra }) => {
  const { usuarios: responsablesList, fetchUsuarios } = useSatelite();
  const [data, setData] = useState<Financista[]>([]);
  const [modalState, setModalState] = useState({
    formOpen: false,
    uploadOpen: false,
    previewOpen: false,
    deleteOpen: false,
    editData: null as Financista | null,
    selectedRowId: null as number | null,
    selectedDocuments: [] as FinancistaFileObject[],
    categoriaId: undefined as number | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const {
    currentPage,
    handlePageChange,
    handleRowsPerPageChange,
    rows,
    rowsPage,
    rowsTotal
  } = usePagination<Financista>(data ?? null);

  const getDocumentosPorActividad = useCallback(
    async (financistaId: number, categoriaId?: number): Promise<FinancistaFileObject[]> => {
      if (!financistaId) return [];
      
      try {
        const params: any = {
          actividad_id: financistaId,
          carpeta_base: CARPETA_FINANCISTA.replace(/^\//, ""),
          codigo_registro: financistaId,
          id_obra,
        };

        if (categoriaId) {
          params.categoria_id = categoriaId;
        }

        const response = await api.get("/archivos/all", { params });
        const documentos = response.data?.data || response.data || [];
        
        return documentos.map((doc: any, index: number) => {
          const nombre = doc.nombre_original || doc.nombre || `archivo_${index}`;
          return {
            id: doc.id ? String(doc.id) : `temp_${index}`,
            file: null,
            url: doc.url || doc.path || `${CARPETA_FINANCISTA}/${nombre}`,
            nombre_original: nombre,
            esImagen: nombre.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) != null,
            esPDF: nombre.toLowerCase().endsWith(".pdf"),
            categoria_id: Number(doc.categoria) || categoriaId || null,
          };
        });
      } catch {
        return [];
      }
    },
    [id_obra]
  );

  const fetchData = useCallback(async () => {
    try {
      const dataArray = await fetchInformacionFinancista(id_obra);
      
      if (dataArray.length === 0) {
        setData([]);
        setErrorMessage(null);
        return;
      }

      const mappedData = await Promise.all(
        dataArray.map(async (item: FinancistaData) => {
          try {
            let categoriasArray: any[] = [];
            if (typeof item.id_categoria_documento === "string") {
              try {
                categoriasArray = JSON.parse(item.id_categoria_documento);
              } catch {}
            } else if (Array.isArray(item.id_categoria_documento)) {
              categoriasArray = item.id_categoria_documento;
            }

            let responsablesArray: any[] = [];
            if (typeof item.responsables === "string") {
              try {
                responsablesArray = JSON.parse(item.responsables);
              } catch {}
            } else if (Array.isArray(item.responsables)) {
              responsablesArray = item.responsables;
            }

            return {
              id: item.id || 0,
              tipo: tipoFinancistaOptions.find(
                opt => opt.value === String(item.id_tipo_financista)
              )?.label || "Desconocido",
              id_tipo_financista: item.id_tipo_financista,
              aspecto: item.aspecto || "",
              comentarios: item.comentarios || "",
              documentos: await getDocumentosPorActividad(item.id || 0),
              responsables: responsablesArray.map((r) => ({
                id: String(r.id),
                nombre: r.nombre || "Desconocido",
              })),
              categorias: categoriasArray.map((c) => ({
                id: String(c.id),
                nombre: c.nombre || "Desconocida",
              })),
              id_obra: item.id_obra || id_obra,
            };
          } catch {
            return null;
          }
        })
      );

      const validData = mappedData.filter((item): item is Financista => item !== null);
      setData(validData);
      setErrorMessage(null);
    } catch (error: any) {
      setData([]);
      setErrorMessage(`Error de conexión: ${error.message}`);
    }
  }, [getDocumentosPorActividad, id_obra]);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchData(), fetchUsuarios()]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchData, fetchUsuarios]);

  const mapToEntityData = useCallback((financista: Financista | null): FinancistaEntityData | null => {
    if (!financista) return null;
    return {
      id: financista.id,
      id_tipo_financista: financista.id_tipo_financista,
      aspecto: financista.aspecto,
      comentarios: financista.comentarios,
      id_categoria_documento: financista.categorias.map((cat) => ({
        id: parseInt(cat.id),
        nombre: cat.nombre,
      })),
      responsables: financista.responsables.map((resp) => ({
        id: parseInt(resp.id),
        nombre: resp.nombre,
      })),
      id_empresa: 1,
      id_obra: financista.id_obra,
    };
  }, []);

  const adaptedSendService = async (
    data: FinancistaEntityData,
    id?: number
  ): Promise<FinancistaEntityData> => {
    const adaptedData: FinancistaDataCreate = {
      id_tipo_financista: data.id_tipo_financista,
      aspecto: data.aspecto,
      comentarios: data.comentarios,
      id_categoria_documento: data.id_categoria_documento || [],
      responsables: data.responsables || [],
      id_obra: id_obra
    };
    
    const response = await sendFinancista(adaptedData, id);
    
    return {
      ...response,
      id_empresa: 1,
    } as FinancistaEntityData;
  };

  const calcularProgreso = useCallback(() => {
    if (!data.length) return 0;
    const totalCategorias = data.reduce((sum, row) => sum + row.categorias.length, 0);
    let categoriasConDocumentos = 0;
    
    data.forEach((row) => {
      row.categorias.forEach((categoria) => {
        const categoriaId = parseInt(categoria.id);
        const tieneDocumento = row.documentos.some((doc) => doc.categoria_id === categoriaId);
        if (tieneDocumento) {
          categoriasConDocumentos += 1;
        }
      });
    });

    return totalCategorias > 0 ? Math.round((categoriasConDocumentos / totalCategorias) * 100) : 0;
  }, [data]);

  const handleOpenModal = useCallback((type: string, row?: Financista, categoriaId?: number) => {
    setModalState((prev) => {
      const filteredDocuments = type === "preview"
        ? (row?.documentos || []).filter((doc) => doc.categoria_id === categoriaId)
        : type === "upload"
        ? []
        : prev.selectedDocuments;
      
      const uniqueDocuments = Array.from(
        new Map(filteredDocuments.map((doc) => [doc.id || doc.url, doc])).values()
      );

      return {
        ...prev,
        formOpen: type === "form",
        uploadOpen: type === "upload",
        previewOpen: type === "preview",
        deleteOpen: type === "delete",
        editData: row || null,
        selectedRowId: row?.id || null,
        selectedDocuments: uniqueDocuments,
        categoriaId: type === "upload" || type === "preview" ? categoriaId : undefined,
      };
    });
  }, []);

  const handleCloseModal = useCallback((type: string) => {
    setModalState((prev) => ({
      ...prev,
      [type]: false,
      editData: type !== "previewOpen" ? null : prev.editData,
      selectedRowId: type === "deleteOpen" ? null : prev.selectedRowId,
      selectedDocuments: type === "previewOpen" || type === "uploadOpen" ? [] : prev.selectedDocuments,
      categoriaId: type === "uploadOpen" || type === "previewOpen" ? undefined : prev.categoriaId,
    }));
  }, []);

  const handleGuardar = async () => {
    await fetchData();
    handleCloseModal("formOpen");
  };

  const handleEliminar = async () => {
    if (!modalState.selectedRowId) {
      handleCloseModal("deleteOpen");
      return;
    }

    try {
      await deleteFinancista(modalState.selectedRowId);

      const financista = data.find((item) => item.id === modalState.selectedRowId);
      if (financista && financista.documentos.length > 0) {
        await Promise.all(
          financista.documentos.map(async (doc) => {
            try {
              await api.delete(`/archivosdelete/${doc.id}`, {
                params: { codigo_registro: modalState.selectedRowId, id_obra },
              });
            } catch {}
          })
        );
      }

      setData((prev) => prev.filter((item) => item.id !== modalState.selectedRowId));
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      handleCloseModal("deleteOpen");
    }
  };

  const handleRemoveDocument = async (index: number) => {
    const doc = modalState.selectedDocuments[index];
    if (!modalState.editData || !doc) return;

    try {
      await api.delete(`/archivosdelete/${doc.id}`, {
        params: {
          codigo_registro: modalState.editData.id,
          id_obra,
        },
      });

      const updatedDocuments = modalState.selectedDocuments.filter((_, i) => i !== index);

      setData((prev) =>
        prev.map((item) =>
          item.id === modalState.editData!.id
            ? { ...item, documentos: item.documentos.filter((d) => d.id !== doc.id) }
            : item
        )
      );

      setModalState((prev) => ({
        ...prev,
        selectedDocuments: updatedDocuments,
      }));

      if (updatedDocuments.length === 0) {
        handleCloseModal("previewOpen");
      }
    } catch {
      fetchData();
    }
  };

  const handleDocumentsSaved = async (actividadId: number) => {
    try {
      const documentosBackend = await getDocumentosPorActividad(actividadId, modalState.categoriaId);
      setData((prev) =>
        prev.map((item) =>
          item.id === actividadId ? { ...item, documentos: documentosBackend } : item
        )
      );

      handleCloseModal("uploadOpen");
    } catch {
      await fetchData();
    }
  };

  const getInitials = (name: string) =>
    name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || name.slice(0, 2).toUpperCase();

  const getCategoryInitials = (categorias: { id: string; nombre: string }[]) =>
    categorias.length ? categorias.map((cat) => getInitials(cat.nombre || "Desconocido")) : ["ND"];

  const columns: TableColumn<Financista>[] = [
    { name: "Tipo", selector: (row) => row.tipo, sortable: true },
    {
      name: "Aspecto",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", overflowWrap: "break-word", maxWidth: "200px", overflow: "visible", lineHeight: "1.5" }}>
          {row.aspecto}
        </div>
      ),
    },
    {
      name: "Comentarios",
      cell: (row) => (
        <div style={{ whiteSpace: "normal", overflowWrap: "break-word", maxWidth: "300px", overflow: "visible", lineHeight: "1.5" }}>
          {row.comentarios}
        </div>
      ),
    },
    {
      name: "Documentos",
      center: true,
      cell: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {getCategoryInitials(row.categorias).map((initials, index) => {
            const categoriaId = parseInt(row.categorias[index]?.id);
            const hasDocuments = row.documentos.some((doc) => doc.categoria_id === categoriaId);
            return (
              <Tooltip key={index} title={row.categorias[index]?.nombre || "Sin categoría"}>
                <button
                  onClick={() => handleOpenModal(hasDocuments ? "preview" : "upload", row, categoriaId)}
                  style={{
                    background: hasDocuments ? "#4CAF50" : "#D3D3D3",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 6px",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {initials}
                </button>
              </Tooltip>
            );
          })}
          {!row.categorias.length && (
            <Tooltip title="Subir documento">
              <IconWrapper>
                <button onClick={() => handleOpenModal("upload", row)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <FaFileUpload size={14} />
                </button>
              </IconWrapper>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      name: "Responsables",
      center: true,
      cell: (row) => (
        <ResponsablesContainer>
          {row.responsables.length ? (
            row.responsables.map((resp, index) => (
              <Tooltip key={index} title={resp.nombre}>
                <ResponsableIcon>{getInitials(resp.nombre)}</ResponsableIcon>
              </Tooltip>
            ))
          ) : (
            <span>Sin responsables</span>
          )}
        </ResponsablesContainer>
      ),
    },
    {
      name: "Opciones",
      center: true,
      cell: (row) => (
        <IconsContainer>
          <Tooltip title="Editar">
            <IconWrapper onClick={() => handleOpenModal("form", row)}>
              <FaEdit size={14} color="#868686" />
            </IconWrapper>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconWrapper onClick={() => handleOpenModal("delete", row)}>
              <FaTrash size={14} color="#868686" />
            </IconWrapper>
          </Tooltip>
        </IconsContainer>
      ),
    },
  ];

  const campos: CampoFormulario[] = [
    {
      key: "id_tipo_financista",
      label: "Tipo de Financista",
      type: "select",
      required: true,
      options: tipoFinancistaOptions,
    },
    { key: "aspecto", label: "Aspecto", type: "text", required: true },
    { key: "comentarios", label: "Comentarios", type: "editor", required: true },
    {
      key: "id_categoria_documento",
      label: "Categoría de Documento",
      type: "select",
      required: false,
      multiple: true,
      options: [],
    },
    {
      key: "responsables",
      label: "Responsables",
      type: "select",
      required: false,
      multiple: true,
      options: responsablesList.map((r) => ({ value: r.id_responsable.toString(), label: r.nombre || "Desconocido" })),
    },
  ];

  return (
    <Container>
      {!isLoading && errorMessage && (
        <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          {errorMessage}
        </div>
      )}
      
      {!isLoading && !errorMessage && (
        <AddButton onClick={() => handleOpenModal("form")}>
          Nuevo Requisito
        </AddButton>
      )}
      
      {!isLoading && !errorMessage && (
        <>
          <ProgressContainer>
            <ProgressLabel>Avance: {calcularProgreso()}%</ProgressLabel>
            <ProgressBarStyled $progress={calcularProgreso()} />
          </ProgressContainer>
          <DataTableCustom
            title=""
            columns={columns}
            data={rows || []}
            totalRows={rowsTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            emptyText="No hay información disponible"
            stickyColumns
          />
        </>
      )}

      {modalState.formOpen && (
        <ModalBackground>
          <FormularioRequisito<FinancistaEntityData>
            onClose={() => handleCloseModal("formOpen")}
            initialData={mapToEntityData(modalState.editData)}
            onGuardar={handleGuardar}
            tituloNuevo="Nuevo Requisito"
            tituloEditar="Editar Requisito"
            campos={campos}
            sendService={adaptedSendService}
            tipoFieldName="id_tipo_financista"
          />
        </ModalBackground>
      )}

      {modalState.uploadOpen && modalState.editData && (
        <ModalBackground onClick={(e) => e.stopPropagation()}>
          <FormularioSubirDocumentos
            onClose={() => handleCloseModal("uploadOpen")}
            categoria="Documentos"
            tipo="financista"
            id_informacionfinancista={modalState.editData.id}
            id_obra={id_obra}
            categoriaId={modalState.categoriaId}
            onDocumentsSaved={() => handleDocumentsSaved(modalState.editData!.id)}
          />
        </ModalBackground>
      )}

      {modalState.previewOpen && (
        <ModalVistaPrevia
          visible={modalState.previewOpen}
          files={modalState.selectedDocuments}
          onClose={() => handleCloseModal("previewOpen")}
          onRemoveFile={handleRemoveDocument}
        />
      )}
      {modalState.deleteOpen && (
        <ModalBackground>
          <ModalEliminar
            isOpen={modalState.deleteOpen}
            onClose={() => handleCloseModal("deleteOpen")}
            onConfirm={handleEliminar}
            mensaje="¿Estás seguro de eliminar este requisito?"
          />
        </ModalBackground>
      )}
    </Container>
  );
};

export default TablaFinancista;