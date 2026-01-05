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
  type FinancistaData,
  deleteFinancista,
} from "../../../services/getInformacionFinancista.service";
import { useSatelite } from "../../../context/DigidatContext";
import { getTiposFinancista } from "../../../services/getTipoInformacion.service";
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
  id_obra_impuesto: number;
}

interface TablaFinancistaProps {
  id_obra_impuesto: number;
}

const tipoFinancistaOptions = [
  { value: "1", label: "Requisito Legal" },
  { value: "2", label: "Información Financiera" },
];

const ID_EMPRESA = 1;

const TablaFinancista: React.FC<TablaFinancistaProps> = ({ id_obra_impuesto }) => {
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
  } = usePagination<Financista>(data ?? null)

  const getDocumentosPorActividad = useCallback(
    async (financistaId: number, categoriaId?: number): Promise<FinancistaFileObject[]> => {
      if (!financistaId) {
        console.warn("[getDocumentosPorActividad] financistaId inválido:", financistaId);
        return [];
      }
      try {
        const params: any = {
          actividad_id: financistaId,
          carpeta_base: CARPETA_FINANCISTA.replace(/^\//, ""),
          codigo_registro: financistaId,
          empresa_id: ID_EMPRESA,
          id_obra_impuesto,
        };
        if (categoriaId) {
          params.categoria_id = categoriaId;
        }
        const response = await api.get("/archivos/all", { params });
        const documentos = response.data?.data || response.data || [];
        return documentos.map((doc: any, index: number) => {
          const nombre = doc.nombre_original || doc.nombre || `archivo_${index}`;
          const processedDoc: FinancistaFileObject = {
            id: doc.id ? String(doc.id) : `temp_${index}`,
            file: null,
            url: doc.url || doc.path || `${CARPETA_FINANCISTA}/${nombre}`,
            nombre_original: nombre,
            esImagen: nombre.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) != null,
            esPDF: nombre.toLowerCase().endsWith(".pdf"),
            categoria_id: Number(doc.categoria) || categoriaId || null,
          };
          return processedDoc;
        });
      } catch (error) {
        console.error(`[getDocumentosPorActividad] Error fetching documents for financista ${financistaId}:`, error);
        return [];
      }
    },
    [id_obra_impuesto]
  );

  const fetchData = useCallback(async () => {
    try {
      const response = await fetchInformacionFinancista(ID_EMPRESA, id_obra_impuesto);
      if (!response.data) {
        throw new Error("Respuesta del backend vacía o inválida");
      }

      const dataToMap = Array.isArray(response.data) ? response.data : [];
      const mappedData = await Promise.all(
        dataToMap.map(
          async (item: FinancistaData & { tipo_financista?: { id: number; name: string } }, index: number) => {
            try {
              let responsablesArray: any[] = [];
              if (typeof item.responsables === "string") {
                try {
                  responsablesArray = JSON.parse(item.responsables);
                } catch (parseError) {
                  console.warn(
                    "[fetchData] Error parseando item.responsables:",
                    item.responsables,
                    parseError
                  );
                  responsablesArray = [];
                }
              } else if (Array.isArray(item.responsables)) {
                responsablesArray = item.responsables;
              } else if (item.responsables && typeof item.responsables === "object") {
                responsablesArray = [item.responsables];
              } else if (item.responsables != null) {
                console.warn(
                  "[fetchData] Valor inesperado en item.responsables:",
                  item.responsables,
                  "Item completo:",
                  JSON.stringify(item, null, 2)
                );
                responsablesArray = [];
              }

              let categoriasArray: any[] = [];
              if (typeof item.id_categoria_documento === "string") {
                try {
                  categoriasArray = JSON.parse(item.id_categoria_documento);
                } catch (parseError) {
                  console.warn(
                    "[fetchData] Error parseando item.id_categoria_documento:",
                    item.id_categoria_documento,
                    parseError
                  );
                  categoriasArray = [];
                }
              } else if (Array.isArray(item.id_categoria_documento)) {
                categoriasArray = item.id_categoria_documento;
              } else if (item.id_categoria_documento != null) {
                console.warn(
                  "[fetchData] Valor inesperado en item.id_categoria_documento:",
                  item.id_categoria_documento
                );
                categoriasArray = [];
              }

              return {
                id: item.id || 0,
                tipo:
                  item.tipo_financista?.name ||
                  tipoFinancistaOptions.find((opt) => opt.value === item.id_tipo_financista?.toString())?.label ||
                  "Desconocido",
                id_tipo_financista: Number(item.id_tipo_financista) || 1,
                aspecto: item.aspecto || "",
                comentarios: item.comentarios || "",
                documentos: await getDocumentosPorActividad(item.id || 0),
                responsables: responsablesArray.map((r) => ({
                  id: r.id ? String(r.id) : "unknown",
                  nombre: r.nombre || "Desconocido",
                })),
                categorias: categoriasArray.map((c) => ({
                  id: c.id ? String(c.id) : "unknown",
                  nombre: c.nombre || "Desconocida",
                })),
                id_obra_impuesto: item.id_obra_impuesto || id_obra_impuesto,
              };
            } catch (mapError) {
              console.error(`[fetchData] Error procesando item ${index}:`, mapError);
              return null;
            }
          }
        )
      );

      const validData = mappedData.filter((item): item is Financista => item !== null);
      setData(validData);
      setErrorMessage(null);
    } catch (error: any) {
      console.error("[fetchData] Error fetching financista data:", error.message, error.stack);
      setData([]);
      setErrorMessage(`Error al cargar los datos de financistas: ${error.message}`);
    }
  }, [getDocumentosPorActividad, id_obra_impuesto]);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchData(), fetchUsuarios()]);
      } catch (error) {
        console.error("[loadData] Error cargando datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchData, fetchUsuarios]);

  const mapToFinancistaData = (financista: Financista | null): FinancistaData | null => {
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
      id_empresa: ID_EMPRESA,
      id_obra_impuesto,
    };
  };

  const calcularProgreso = () => {
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
  };

  const handleOpenModal = useCallback((type: string, row?: Financista, categoriaId?: number) => {
    setModalState((prev) => {
      const filteredDocuments = type === "preview"
        ? (row?.documentos || []).filter((doc) => doc.categoria_id === categoriaId)
        : type === "upload"
        ? []
        : prev.selectedDocuments;
      const uniqueDocuments = Array.from(
        new Map(filteredDocuments.map((doc) => [doc.id || doc.url || `temp-${doc.nombre_original}`, doc])).values()
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

  const handleGuardar = async (
    response: FinancistaData & { tipo_financista?: { id: number; name: string }, obra_id?: number },
    formattedValues?: FinancistaData
  ) => {
    try {
      const financistaId = response.id || formattedValues?.id || response.obra_id;

      if (!financistaId) {
        await fetchData();
        handleCloseModal("formOpen");
        return;
      }

      if (modalState.editData) {
        const documentos = await getDocumentosPorActividad(financistaId);
        const tipo =
          response.tipo_financista?.name ||
          tipoFinancistaOptions.find(
            (opt) => opt.value === (response.id_tipo_financista || formattedValues?.id_tipo_financista)?.toString()
          )?.label ||
          "Desconocido";

        const responsablesRaw = formattedValues?.responsables || response.responsables || [];
        let responsablesArray: any[] = [];
        if (typeof responsablesRaw === "string") {
          try {
            responsablesArray = JSON.parse(responsablesRaw);
          } catch (parseError) {
            console.warn("[handleGuardar] Error parseando responsablesRaw:", responsablesRaw, parseError);
            responsablesArray = [];
          }
        } else if (Array.isArray(responsablesRaw)) {
          responsablesArray = responsablesRaw;
        } else if (responsablesRaw && typeof responsablesRaw === "object") {
          responsablesArray = [responsablesRaw];
        }

        const categoriasRaw = formattedValues?.id_categoria_documento || response.id_categoria_documento || [];
        let categoriasArray: any[] = [];
        if (typeof categoriasRaw === "string") {
          try {
            categoriasArray = JSON.parse(categoriasRaw);
          } catch (parseError) {
            console.warn("[handleGuardar] Error parseando categoriasRaw:", categoriasRaw, parseError);
            categoriasArray = [];
          }
        } else if (Array.isArray(categoriasRaw)) {
          categoriasArray = categoriasRaw;
        }

        const nuevoFinancista: Financista = {
          id: financistaId,
          tipo,
          id_tipo_financista: Number(formattedValues?.id_tipo_financista || response.id_tipo_financista) || 1,
          aspecto: response.aspecto || formattedValues?.aspecto || "",
          comentarios: response.comentarios || formattedValues?.comentarios || "",
          documentos,
          responsables: responsablesArray.map((r) => ({
            id: r.id ? String(r.id) : "unknown",
            nombre: r.nombre || "Desconocido",
          })),
          categorias: categoriasArray.map((c) => ({
            id: c.id ? String(c.id) : "unknown",
            nombre: c.nombre || "Desconocida",
          })),
          id_obra_impuesto,
        };

        setData((prev) =>
          prev.map((item) => (item.id === nuevoFinancista.id ? nuevoFinancista : item))
        );
      } else {
        await fetchData();
      }

      handleCloseModal("formOpen");
    } catch (error: any) {
      console.error("[handleGuardar] Error processing financista:", error.message, error.stack);
      await fetchData();
      handleCloseModal("formOpen");
    }
  };

  const handleEliminar = async () => {
    if (!modalState.selectedRowId) {
      console.warn("[handleEliminar] No se proporcionó selectedRowId");
      handleCloseModal("deleteOpen");
      return;
    }

    try {
      await deleteFinancista(modalState.selectedRowId, id_obra_impuesto);

      const financista = data.find((item) => item.id === modalState.selectedRowId);
      if (financista && financista.documentos.length > 0) {
        await Promise.all(
          financista.documentos.map(async (doc) => {
            try {
              await api.delete(`/archivosdelete/${doc.id}`, {
                params: { codigo_registro: modalState.selectedRowId, id_obra_impuesto },
              });
            } catch (docError) {
              console.warn(`[handleEliminar] Error al eliminar documento ${doc.id}:`, docError);
            }
          })
        );
      }

      setData((prev) => {
        const newData = prev.filter((item) => item.id !== modalState.selectedRowId);
        return newData;
      });
    } catch (error: any) {
      console.error("[handleEliminar] Error al eliminar financista:", error.message, error.stack);
      alert(`Error al eliminar el requisito: ${error.message}`);
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
          id_obra_impuesto,
          empresa_id: ID_EMPRESA,
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
    } catch (error) {
      console.error("[handleRemoveDocument] Error removing document:", error);
      fetchData();
    }
  };

  const handleDocumentsSaved = async (
    actividadId: number,
    nuevosDocumentos: { file: File; url: string; id: number }[]
  ) => {
    try {
      setData((prev) =>
        prev.map((item) =>
          item.id === actividadId
            ? {
                ...item,
                documentos: [
                  ...item.documentos,
                  ...nuevosDocumentos.map((doc, index) => ({
                    id: `temp_${index}_${Date.now()}`,
                    file: doc.file,
                    url: doc.url,
                    nombre_original: doc.file.name,
                    esImagen: doc.file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) != null,
                    esPDF: doc.file.name.toLowerCase().endsWith(".pdf"),
                    categoria_id: modalState.categoriaId || null,
                  })),
                ],
              }
            : item
        )
      );

      const documentosBackend = await getDocumentosPorActividad(actividadId, modalState.categoriaId);
      setData((prev) =>
        prev.map((item) =>
          item.id === actividadId
            ? { ...item, documentos: documentosBackend }
            : item
        )
      );

      handleCloseModal("uploadOpen");
    } catch (error) {
      console.error("[handleDocumentsSaved] Error al procesar documentos:", error);
      setErrorMessage("Error al procesar los documentos.");
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
        <div
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            maxWidth: "200px",
            overflow: "visible",
            lineHeight: "1.5",
          }}
        >
          {row.aspecto}
        </div>
      ),
    },
    {
      name: "Comentarios",
      cell: (row) => (
        <div
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            maxWidth: "300px",
            overflow: "visible",
            lineHeight: "1.5",
          }}
        >
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
                <button
                  onClick={() => handleOpenModal("upload", row)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
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
      {!isLoading && errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {!isLoading && !errorMessage && (
        <>
          <AddButton onClick={() => handleOpenModal("form")}>Nuevo Requisito</AddButton>
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
            emptyText="No hay datos disponibles"
            stickyColumns
          />
        </>
      )}
      {modalState.formOpen && (
        <ModalBackground>
          <FormularioRequisito<FinancistaData>
            onClose={() => handleCloseModal("formOpen")}
            initialData={mapToFinancistaData(modalState.editData)}
            onGuardar={handleGuardar}
            tituloNuevo="Nuevo Requisito"
            tituloEditar="Editar Requisito"
            campos={campos}
            sendService={(data, id) => sendFinancista(data, id_obra_impuesto, id)}
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
            actividadId={modalState.editData.id}
            carpetaBase={CARPETA_FINANCISTA}
            onDocumentsSaved={(docs) => handleDocumentsSaved(modalState.editData!.id, docs)}
            codigoRegistro={modalState.editData.id}
            id_obra={id_obra_impuesto}
            categoriaId={modalState.categoriaId}
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