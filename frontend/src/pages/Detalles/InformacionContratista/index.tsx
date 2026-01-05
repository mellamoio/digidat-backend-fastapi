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
  fetchInformacionContratista,
  sendContratista,
  type ContratistaData,
  deleteContratista,
} from "../../../services/getInformacionContratista.service";
import { useSatelite } from "../../../context/DigidatContext";
import { getTiposContratista } from "../../../services/getTipoInformacion.service";
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
import { CARPETA_CONTRATISTA } from "../../../constants/carpetas";
import type { FileObject } from "../../../types/pagos";
import api from "../../../api/api";
import { usePagination } from "../../../hooks/usePagination";

interface ContratistaFileObject extends FileObject {
  categoria_id?: number | null;
}

interface Contratista {
  id: number;
  tipo: string;
  id_tipo_contratista: number;
  aspecto: string;
  comentarios: string;
  documentos: ContratistaFileObject[];
  responsables: { id: string; nombre: string }[];
  categorias: { id: string; nombre: string }[];
  id_obra_impuesto: number;
}

interface TablaContratistaProps {
  id_obra_impuesto: number;
}

const tipoContratistaOptions = [
  { value: "1", label: "Infraestructura" },
  { value: "2", label: "Sobre Experiencia del Ejecutor" },
  { value: "3", label: "Sobre Experiencia de los Profesionales" }
];

const ID_EMPRESA = 1;

const TablaContratista: React.FC<TablaContratistaProps> = ({ id_obra_impuesto }) => {
  const { usuarios: responsablesList, fetchUsuarios } = useSatelite();
  const [data, setData] = useState<Contratista[]>([]);
  const [tipoOptions, setTipoOptions] = useState<{ value: string; label: string }[]>([]);
  const [modalState, setModalState] = useState({
    formOpen: false,
    uploadOpen: false,
    previewOpen: false,
    deleteOpen: false,
    editData: null as Contratista | null,
    selectedRowId: null as number | null,
    selectedDocuments: [] as ContratistaFileObject[],
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
  } = usePagination<Contratista>(data ?? null)
  const loadTipos = useCallback(async () => {
    try {
      const tipos = await getTiposContratista(ID_EMPRESA);
      const options = tipos.map((tipo) => ({
        value: tipo.id.toString(),
        label: tipo.name || "Sin nombre",
      }));
      setTipoOptions(options);
      return options;
    } catch (error) {
      console.error("[loadTipos] Error cargando tipos de contratista:", error);
      setErrorMessage("Error al cargar los tipos de contratista.");
      return [];
    }
  }, []);

  const getDocumentosPorActividad = useCallback(
    async (contratistaId: number, categoriaId?: number): Promise<ContratistaFileObject[]> => {
      if (!contratistaId) {
        console.warn("[getDocumentosPorActividad] contratistaId inválido:", contratistaId);
        return [];
      }
      try {
        const params: any = {
          actividad_id: contratistaId,
          carpeta_base: CARPETA_CONTRATISTA.replace(/^\//, ""),
          codigo_registro: contratistaId,
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
          return {
            id: doc.id ? String(doc.id) : `temp_${index}`,
            file: null,
            url: doc.url || doc.path || `${CARPETA_CONTRATISTA}/${nombre}`,
            nombre_original: nombre,
            esImagen: nombre.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) != null,
            esPDF: nombre.toLowerCase().endsWith(".pdf"),
            categoria_id: Number(doc.categoria) || categoriaId || null,
          };
        });
      } catch (error) {
        console.error(
          `[getDocumentosPorActividad] Error fetching documents for contratista ${contratistaId}:`,
          error
        );
        return [];
      }
    },
    [id_obra_impuesto]
  );

  const fetchData = useCallback(async (tipoOptions: { value: string; label: string }[]) => {
    try {
      setIsLoading(true);
      const response = await fetchInformacionContratista(ID_EMPRESA, id_obra_impuesto);
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error("Respuesta del backend vacía o inválida");
      }

      const mappedData: Contratista[] = [];
      for (const item of response.data) {
        let responsablesArray: any[] = [];
        if (item.responsables) {
          if (typeof item.responsables === "string") {
            try {
              responsablesArray = JSON.parse(item.responsables);
            } catch (parseError) {
              console.warn(
                "[fetchData] Error parseando item.responsables:",
                item.responsables,
                parseError
              );
            }
          } else if (Array.isArray(item.responsables)) {
            responsablesArray = item.responsables;
          } else if (typeof item.responsables === "object") {
            responsablesArray = [item.responsables];
          }
        }

        let categoriasArray: any[] = [];
        if (item.id_categoria_documento) {
          if (typeof item.id_categoria_documento === "string") {
            try {
              categoriasArray = JSON.parse(item.id_categoria_documento);
            } catch (parseError) {
              console.warn(
                "[fetchData] Error parseando item.id_categoria_documento:",
                item.id_categoria_documento,
                parseError
              );
            }
          } else if (Array.isArray(item.id_categoria_documento)) {
            categoriasArray = item.id_categoria_documento;
          } else if (typeof item.id_categoria_documento === "object") {
            categoriasArray = [item.id_categoria_documento];
          }
        }

        const documentos = await getDocumentosPorActividad(item.id || 0);

        const tipo = tipoOptions.find(
          (opt) => opt.value === String(item.id_tipo_contratista)
        )?.label || "Desconocido";

        const contratista: Contratista = {
          id: item.id || 0,
          tipo,
          id_tipo_contratista: Number(item.id_tipo_contratista) || 1,
          aspecto: item.aspecto || "",
          comentarios: item.comentarios || "",
          documentos,
          responsables: responsablesArray.map((r: any) => ({
            id: r.id ? String(r.id) : "unknown",
            nombre: r.nombre || "Desconocido",
          })),
          categorias: categoriasArray.map((c: any) => ({
            id: c.id ? String(c.id) : "unknown",
            nombre: c.nombre || "Desconocida",
          })),
          id_obra_impuesto,
        };

        mappedData.push(contratista);
      }

      setData(mappedData);
      setErrorMessage(null);
    } catch (error: any) {
      console.error("[fetchData] Error fetching contratista data:", error);
      setData([]);
      setErrorMessage(`Error al cargar los datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [getDocumentosPorActividad, id_obra_impuesto]);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadData = async () => {
      try {
        const tipos = await loadTipos();
        await Promise.all([fetchData(tipos), fetchUsuarios()]);
      } catch (error) {
        console.error("[loadData] Error cargando datos iniciales:", error);
        setErrorMessage("Error al cargar los datos iniciales.");
      }
    };
    loadData();
  }, [fetchData, fetchUsuarios, loadTipos]);

  const mapToContratistaData = (contratista: Contratista | null): ContratistaData | null => {
    if (!contratista) return null;
    return {
      id: contratista.id,
      id_tipo_contratista: contratista.id_tipo_contratista,
      aspecto: contratista.aspecto,
      comentarios: contratista.comentarios,
      id_categoria_documento: contratista.categorias.map((cat) => ({
        id: parseInt(cat.id),
        nombre: cat.nombre,
      })),
      responsables: contratista.responsables.map((resp) => ({
        id: parseInt(resp.id),
        nombre: resp.nombre,
      })),
      id_empresa: ID_EMPRESA,
      id_obra_impuesto,
    };
  };

  const calcularProgreso = () => {
    if (!data.length) return 0;
    const totalCategorias = data.reduce(
      (sum, row) => sum + row.categorias.length,
      0
    );
    let categoriasConDocumentos = 0;
    data.forEach((row) => {
      row.categorias.forEach((categoria) => {
        const categoriaId = parseInt(categoria.id);
        const tieneDocumento = row.documentos.some(
          (doc) => doc.categoria_id === categoriaId
        );
        if (tieneDocumento) {
          categoriasConDocumentos += 1;
        }
      });
    });
    return totalCategorias > 0
      ? Math.round((categoriasConDocumentos / totalCategorias) * 100)
      : 0;
  };

  const handleOpenModal = useCallback(
    (type: string, row?: Contratista, categoriaId?: number) => {
      setModalState((prev) => {
        const filteredDocuments =
          type === "preview"
            ? (row?.documentos || []).filter(
                (doc) => doc.categoria_id === categoriaId
              )
            : type === "upload"
            ? []
            : prev.selectedDocuments;
        const uniqueDocuments = Array.from(
          new Map(
            filteredDocuments.map((doc) => [
              doc.id || doc.url || `temp-${doc.nombre_original}`,
              doc,
            ])
          ).values()
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
          categoriaId:
            type === "upload" || type === "preview" ? categoriaId : undefined,
        };
      });
    },
    []
  );

  const handleCloseModal = useCallback((type: string) => {
    setModalState((prev) => ({
      ...prev,
      [type]: false,
      editData: type !== "previewOpen" ? null : prev.editData,
      selectedRowId: type === "deleteOpen" ? null : prev.selectedRowId,
      selectedDocuments:
        type === "previewOpen" || type === "uploadOpen"
          ? []
          : prev.selectedDocuments,
      categoriaId:
        type === "uploadOpen" || type === "previewOpen"
          ? undefined
          : prev.categoriaId,
    }));
  }, []);

  const handleGuardar = async (
    response: ContratistaData,
    formattedValues?: ContratistaData
  ) => {
    try {

      const contratistaId = response.id || formattedValues?.id;
      if (!contratistaId) {
        console.error("[handleGuardar] No se proporcionó un contratistaId válido");
        throw new Error("No se proporcionó un contratistaId válido");
      }

      const documentos = await getDocumentosPorActividad(contratistaId);

      const tipo = tipoOptions.find(
        (opt) => opt.value === String(response.id_tipo_contratista || formattedValues?.id_tipo_contratista)
      )?.label || "Desconocido";

      const responsablesRaw = formattedValues?.responsables || response.responsables || [];
      let responsablesArray: any[] = [];
      if (typeof responsablesRaw === "string") {
        try {
          responsablesArray = JSON.parse(responsablesRaw);
        } catch (parseError) {
          console.warn("[handleGuardar] Error parseando responsablesRaw:", responsablesRaw, parseError);
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
        }
      } else if (Array.isArray(categoriasRaw)) {
        categoriasArray = categoriasRaw;
      } else if (categoriasRaw && typeof categoriasRaw === "object") {
        categoriasArray = [categoriasRaw];
      }

      const nuevoContratista: Contratista = {
        id: contratistaId,
        tipo,
        id_tipo_contratista: Number(formattedValues?.id_tipo_contratista || response.id_tipo_contratista) || 1,
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

      setData((prev) => {
        const exists = prev.some((item) => item.id === contratistaId);
        if (exists) {
          return prev.map((item) => (item.id === contratistaId ? nuevoContratista : item));
        }
        return [...prev, nuevoContratista];
      });

      handleCloseModal("formOpen");
    } catch (error: any) {
      console.error("[handleGuardar] Error al guardar contratista:", error);
      setErrorMessage(`Error al guardar el contratista: ${error.message}`);
      await fetchData(tipoOptions);
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
      await deleteContratista(modalState.selectedRowId, id_obra_impuesto);
      setData((prev) => prev.filter((item) => item.id !== modalState.selectedRowId));
    } catch (error: any) {
      console.error("[handleEliminar] Error al eliminar:", error);
      setErrorMessage(`Error al eliminar el requisito: ${error.message}`);
      await fetchData(tipoOptions);
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
      setErrorMessage("Error al eliminar el documento.");
      await fetchData(tipoOptions);
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
      await fetchData(tipoOptions);
    }
  };

  const getInitials = (name: string) =>
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || name.slice(0, 2).toUpperCase();

  const getCategoryInitials = (categorias: { id: string; nombre: string }[]) =>
    categorias.length
      ? categorias.map((cat) => getInitials(cat.nombre || "Desconocido"))
      : ["ND"];

  const columns: TableColumn<Contratista>[] = [
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
            const hasDocuments = row.documentos.some(
              (doc) => doc.categoria_id === categoriaId
            );

            return (
              <Tooltip
                key={index}
                title={row.categorias[index]?.nombre || "Sin categoría"}
              >
                <button
                  onClick={() =>
                    handleOpenModal(hasDocuments ? "preview" : "upload", row, categoriaId)
                  }
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
      key: "id_tipo_contratista",
      label: "Tipo de Contratista",
      type: "select",
      required: true,
    },
    { key: "aspecto", label: "Aspecto", type: "text", required: true },
    { key: "comentarios", label: "Comentarios", type: "editor", required: true },
    {
      key: "id_categoria_documento",
      label: "Categoría de Documento",
      type: "select",
      required: false,
      multiple: true,
    },
    {
      key: "responsables",
      label: "Responsables",
      type: "select",
      required: false,
      multiple: true,
      options: responsablesList.map((r) => ({
        value: r.id_responsable.toString(),
        label: r.nombre || "Desconocido",
      })),
    },
  ];

  return (
    <Container>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

        <>
          <AddButton onClick={() => handleOpenModal("form")}>
            Nuevo Requisito
          </AddButton>
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
      {modalState.formOpen && (
        <ModalBackground>
          <FormularioRequisito<ContratistaData>
            onClose={() => handleCloseModal("formOpen")}
            initialData={mapToContratistaData(modalState.editData)}
            onGuardar={(response, formattedValues) =>
              handleGuardar(response, formattedValues)
            }
            tituloNuevo="Nuevo Requisito"
            tituloEditar="Editar Requisito"
            campos={campos}
            sendService={(data, id) => sendContratista(data, id_obra_impuesto, id)}
            tipoFieldName="id_tipo_contratista"
          />
        </ModalBackground>
      )}
      {modalState.uploadOpen && modalState.editData && (
        <ModalBackground onClick={(e) => e.stopPropagation()}>
          <FormularioSubirDocumentos
            onClose={() => handleCloseModal("uploadOpen")}
            categoria="Documentos"
            tipo="contratista"
            actividadId={modalState.editData.id}
            carpetaBase={CARPETA_CONTRATISTA}
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

export default TablaContratista;