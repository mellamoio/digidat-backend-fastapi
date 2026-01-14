import type { TableColumn } from "react-data-table-component";
import { FaFileUpload, FaTimes, FaEdit, FaTrash, FaPaperclip } from "react-icons/fa";
import { Tooltip, message, Input, DatePicker, Dropdown, Menu, Select, Checkbox } from "antd";
import { useState, useEffect, useCallback } from "react";
import ModalDocumento from "../../../components/ui/feedback/Modal/ModalDocumento";
import ModalVistaPrevia from "../../../components/ui/feedback/Modal/ModalVistaPrevia";
import ModalEliminar from "../../../components/ui/feedback/Modal/ModalEliminar";
import { FiltroPagos } from "./Filtro/index";
import { CARPETA_PAGOS } from "../../../constants/carpetas";
import {
  FlexContainer,
  ContentWrapper,
  MontoWrapper,
  MontosContainer,
  FiltroWrapper,
  PagosContainer,
  AddButton,
  FormContainer,
  ModalOverlay,
  ModalContent,
  Header,
  MontoContainer,
  Monto,
  IconButton,
  ModalHeader,
  CloseButton,
  ModalBody,
  Label,
  InputMonto,
  ButtonContainer,
  SaveButton,
  AddPagoButton,
  TableWrapper,
} from "./index.styled";
import { fetchPagos, addPago, updatePago, deletePago, fetchTiposGasto } from "../../../services/getPagos.service";
import { userService } from "../../../services/getUser.service";
import type { User } from "../../../types/user";
import { fetchBeneficiarios } from "../../../services/getBeneficiario.service";
import type { Beneficiario } from "../../../types/beneficiario";
import apiClient from "../../../api/api";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type {
  Pago,
  TipoGasto,
  EstadoReembolso,
  FileObject,
  FiltroValues, 
  NewPago,
  Obra,
} from "../../../types/pagos";
import { DataTableCustom } from "../../../components/DataTableCustom";
import { useSatelite } from "../../../context/DigidatContext";
import { usePagination } from "../../../hooks/usePagination";

const { Option } = Select;

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface PagosProps {
  id_obra: number;
}

const InitialsIcon: React.FC<{ name: string }> = ({ name }) => {
  const displayName = name && name !== "N/A" ? name : "Sin Asignar";
  const initials =
    displayName !== "Sin Asignar"
      ? displayName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "SA";
  return (
    <Tooltip title={displayName} placement="top">
      <div
        style={{
          width: "27px",
          height: "27px",
          borderRadius: "50%",
          backgroundColor: displayName === "Sin Asignar" ? "#E0E0E0" : "#D9D9D9",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "normal",
          cursor: "pointer",
        }}
      >
        {initials}
      </div>
    </Tooltip>
  );
};

const Pagos: React.FC<PagosProps> = ({ id_obra }) => {
  const [montoReembolsado, setMontoReembolsado] = useState(0);
  const [montoPagado, setMontoPagado] = useState(0);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPagoId, setEditPagoId] = useState<number | undefined>(undefined);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [fileUrls, setFileUrls] = useState<FileObject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [filteredPagos, setFilteredPagos] = useState<Pago[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [responsables, setResponsables] = useState<User[]>([]);
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [shouldReloadData, setShouldReloadData] = useState(false);
  const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([]);
  const [isFiltroCollapsed, setIsFiltroCollapsed] = useState(false);

  const {
    currentPage,
    handlePageChange,
    handleRowsPerPageChange,
    rows,
    rowsPage,
    rowsTotal
  } = usePagination<Pago>(filteredPagos ?? null);

  const [estadosReembolso] = useState<EstadoReembolso[]>([
    { id_estado_reembolso: 1, nombre: "Reembolsado" },
    { id_estado_reembolso: 2, nombre: "No Reembolsado" },
  ]);
  
  const [refresh, setRefresh] = useState(0);
  const [errors, setErrors] = useState<{
    concepto?: boolean;
    id_beneficiario?: boolean;
    fecha_pago?: boolean;
    monto_pagado?: boolean;
    id_tipo_gasto?: boolean;
    id_estado_reembolso?: boolean;
    id_responsable?: boolean;
    id_obra?: boolean;
    es_reembolsable?: boolean;
  }>({});

  // Cargar responsables
  useEffect(() => {
    const loadResponsables = async () => {
      try {
        const fetchedUsers: User[] = await userService.getUsers();
        
        const usuariosActivos = fetchedUsers.filter((user) => {
          const esActivo = user.estado === true || user.estado === 'ACTIVO';
          return esActivo;
        });
        
        setResponsables(usuariosActivos);
      } catch (error: any) {
        console.error("[useEffect-Responsables] Error:", error);
        message.error("No se pudieron cargar los responsables");
        setResponsables([]);
      }
    };
    loadResponsables();
  }, []);

  useEffect(() => {
  }, [responsables]);

  useEffect(() => {
    const loadTiposGasto = async () => {
      try {
        const tipos = await fetchTiposGasto();
        setTiposGasto(tipos);
      } catch (error) {
        console.error("[useEffect-TiposGasto] Error:", error);
        setTiposGasto([
          { id: 1, nombre: "Administrativo" },
          { id: 2, nombre: "Reembolsable" },
        ]);
      }
    };
    loadTiposGasto();
  }, []);

  const [newPago, setNewPago] = useState<NewPago>({
    concepto: "",
    id_beneficiario: null,
    fecha_pago: "",
    monto_pagado: 0,
    id_tipo_gasto: 1,
    es_reembolsable: false,
    id_estado_reembolso: 2,
    id_obra: id_obra,
    id_responsable: null,
  });

  const calculateTotals = (pagosList: Pago[]) => {
    let totalPagado = 0;
    let totalReembolsado = 0;
    pagosList.forEach((pago: Pago) => {
      const monto = Number(pago.monto_pagado) || 0;
      totalPagado += monto;
      if (pago.id_estado_reembolso === 1) {
        totalReembolsado += monto;
      }
    });
    setMontoPagado(totalPagado);
    setMontoReembolsado(totalReembolsado);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    
    try {
      const obrasResponse = await apiClient.get("/v1/obras/", {});
      const fetchedObras = obrasResponse.data.data || [];
      setObras(fetchedObras);

      const fetchedPagos = await fetchPagos(id_obra);
      const sortedPagos = fetchedPagos.sort((a, b) => Number(b.id_pago) - Number(a.id_pago));
      setPagos(sortedPagos);
      setFilteredPagos(sortedPagos);
      calculateTotals(sortedPagos);

    } catch (error: any) {
      console.error("[loadData] âŒ Error al cargar pagos/obras:", error);
      if (error.response?.status === 403) {
        message.error("Acceso denegado: No tienes permisos para ver las obras.");
      } else {
        message.error(`Error al cargar datos: ${error.message}`);
      }
      setPagos([]);
      setFilteredPagos([]);
      setObras([]);
    }

    try {
      const fetchedBeneficiarios = await fetchBeneficiarios(0, 100);
      setBeneficiarios(fetchedBeneficiarios);
    } catch (error: any) {
      console.error("[loadData] 3. âŒ Error al cargar beneficiarios:", error);
      
      try {
        const fetchedBeneficiarios = await userService.getUsers();
        const beneficiariosConverted: Beneficiario[] = fetchedBeneficiarios.map((beneficiario: User) => {
          const nombreCompleto = beneficiario.nombre || "Sin Nombre";
          return {
            id_beneficiario: beneficiario.id_responsable,
            nombre: nombreCompleto.trim(),
            documento: null,
          };
        });
        setBeneficiarios(beneficiariosConverted);
      } catch (fallbackError: any) {
        console.error("[loadData] 3. âŒ Error en fallback:", fallbackError);
        message.error("No se pudieron cargar los beneficiarios");
        setBeneficiarios([]);
      }
    }

    setLoading(false);
    setShouldReloadData(false);
  }, [id_obra]);

  useEffect(() => {
    loadData();
  }, [refresh, id_obra, loadData]);

  useEffect(() => {
    const handlePagosUpdated = () => {
      setShouldReloadData(true);
    };

    window.addEventListener("pagosUpdated", handlePagosUpdated);

    return () => {
      window.removeEventListener("pagosUpdated", handlePagosUpdated);
    };
  }, []);

  useEffect(() => {
    if (shouldReloadData) {
      loadData();
    }
  }, [shouldReloadData, loadData]);

  const getDocumentosPorActividad = async (pagoId: number): Promise<FileObject[]> => {
    try {
      const response = await apiClient.get("/archivos/all", {
        params: {
          actividad_id: pagoId,
          carpeta_base: CARPETA_PAGOS.replace(/^\//, ""),
          codigo_registro: pagoId,
          id_obra,
        },
      });
      const documentos = response.data?.data || response.data || [];
      return documentos.map((doc: any, index: number) => ({
        id: doc.id ? String(doc.id) : `temp_${index}`,
        file: null,
        url: doc.url || `${CARPETA_PAGOS}/${doc.nombre_original || doc.nombre}`,
        nombre_original: doc.nombre_original || doc.nombre || "archivo",
        esImagen: doc.nombre?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) != null,
        esPDF: doc.nombre?.toLowerCase().endsWith(".pdf"),
      }));
    } catch (error: any) {
      console.error(`[getDocumentosPorActividad] Error al recuperar documentos para pago ${pagoId}:`, error);
      message.error("Error al obtener documentos.");
      return [];
    }
  };

  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === "") {
      return "S/. 0.00";
    }
    const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
    return isNaN(numericValue)
      ? "S/. 0.00"
      : `S/. ${numericValue.toLocaleString("es-PE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  };

  const formatDate = (date: string): string => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "";
  };

  const getCostoProyecto = (obraId: number) => {
    const localStorageValue = localStorage.getItem(`costoProyecto_${obraId}`);
    if (localStorageValue) return localStorageValue;
    const obra = obras.find((o) => o.id_obra === obraId);
    return obra ? formatCurrency(obra.costo_proyecto) : "S/. 0.00";
  };

  const handleFilterChange = (filters: FiltroValues) => {
    const { year, fechaInicio, fechaFin, concepto, beneficiario } = filters;

    let filtered = [...pagos].filter((pago) => pago.id_obra === id_obra);

    if (year) {
      filtered = filtered.filter((pago) => {
        const pagoYear = new Date(pago.fecha_pago).getFullYear().toString();
        return pagoYear === year;
      });
    }

    if (fechaInicio && fechaFin) {
      filtered = filtered.filter((pago) => {
        const pagoFecha = dayjs(pago.fecha_pago);
        const inicio = dayjs(fechaInicio);
        const fin = dayjs(fechaFin);
        return pagoFecha.isSameOrAfter(inicio, "day") && pagoFecha.isSameOrBefore(fin, "day");
      });
    }

    if (concepto) {
      filtered = filtered.filter((pago) => pago.concepto.toLowerCase().includes(concepto.toLowerCase()));
    }

    if (beneficiario && beneficiario.length > 0) {
      filtered = filtered.filter((pago) => {
        const beneficiarioNombre = beneficiarios.find(b => b.id_beneficiario === pago.id_beneficiario)?.nombre || "";
        return beneficiario.includes(beneficiarioNombre.toLowerCase());
      });
    }

    filtered = filtered.sort((a, b) => Number(b.id_pago) - Number(a.id_pago));
    
    setFilteredPagos(filtered);
    calculateTotals(filtered);
  };

  const handleEditPago = (index: number) => {
    const pago = filteredPagos[index];
    if (!pago.id_pago) {
      message.error("ID del pago no disponible para ediciÃ³n.");
      return;
    }
    setEditingIndex(index);
    setEditPagoId(pago.id_pago);
    setNewPago({
      concepto: pago.concepto || "",
      id_beneficiario: pago.id_beneficiario,
      fecha_pago: pago.fecha_pago || "",
      monto_pagado: pago.monto_pagado,
      id_tipo_gasto: pago.id_tipo_gasto || 1,
      es_reembolsable: pago.es_reembolsable || false,
      id_estado_reembolso: pago.id_estado_reembolso || 2,
      id_obra: id_obra,
      id_responsable: pago.id_responsable,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleOpenModal = () => {
    const costo = getCostoProyecto(id_obra);
    setEditValue(costo.replace("S/. ", "").replace(/,/g, ""));
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleSaveMonto = () => {
    const numericValue = parseFloat(editValue.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) {
      message.error("Por favor, ingrese un monto vÃ¡lido.");
      return;
    }
    const formattedMonto = formatCurrency(numericValue);
    localStorage.setItem(`costoProyecto_${id_obra}`, formattedMonto);
    setShowEditModal(false);
    message.success("Costo del proyecto actualizado correctamente.");
  };

  const handleInputChange = (name: string, value: string | number | dayjs.Dayjs | boolean | null | undefined) => {
    setNewPago((prev) => {
      const updates: Partial<NewPago> = {};
      
      if (name === "concepto") updates.concepto = value as string || "";
      if (name === "id_beneficiario") updates.id_beneficiario = value as number | null;
      if (name === "fecha_pago") {
        // âœ… CORRECCIÃ“N: Validar el tipo antes de pasar a dayjs
        if (value && typeof value !== 'boolean') {
          updates.fecha_pago = dayjs(value as string | number | dayjs.Dayjs | Date).format("YYYY-MM-DD");
        } else {
          updates.fecha_pago = "";
        }
      }
      if (name === "monto_pagado") updates.monto_pagado = typeof value === "string" ? parseFloat(value) || 0 : value as number;
      if (name === "id_tipo_gasto") {
        updates.id_tipo_gasto = value as number;
        // LÃ³gica: Si selecciona Administrativo, es_reembolsable = false
        const tipoSeleccionado = tiposGasto.find(t => t.id === value);
        if (tipoSeleccionado?.nombre.toLowerCase() === "administrativo") {
          updates.es_reembolsable = false;
        }
      }
      if (name === "es_reembolsable") updates.es_reembolsable = value as boolean;
      if (name === "id_estado_reembolso") updates.id_estado_reembolso = value as number;
      if (name === "id_responsable") updates.id_responsable = value as number | null;

      return { ...prev, ...updates, id_obra };
    });
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!newPago.concepto.trim()) newErrors.concepto = true;
    if (!newPago.id_beneficiario) newErrors.id_beneficiario = true;
    if (!newPago.fecha_pago) newErrors.fecha_pago = true;
    if (!newPago.monto_pagado || newPago.monto_pagado <= 0) newErrors.monto_pagado = true;
    if (!newPago.id_tipo_gasto) newErrors.id_tipo_gasto = true;
    if (!newPago.id_estado_reembolso) newErrors.id_estado_reembolso = true;
    if (!newPago.id_obra) newErrors.id_obra = true;
    if (!newPago.id_responsable) newErrors.id_responsable = true;

    // ValidaciÃ³n: Si es Administrativo, no puede ser reembolsable
    const tipoSeleccionado = tiposGasto.find(t => t.id === newPago.id_tipo_gasto);
    if (tipoSeleccionado?.nombre.toLowerCase() === "administrativo" && newPago.es_reembolsable) {
      message.error("Un gasto administrativo no puede ser reembolsable");
      newErrors.es_reembolsable = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFormState = () => {
    setShowForm(false);
    setNewPago({
      concepto: "",
      id_beneficiario: null,
      fecha_pago: "",
      monto_pagado: 0,
      id_tipo_gasto: tiposGasto[0]?.id || 1,
      es_reembolsable: false,
      id_estado_reembolso: 2,
      id_obra: id_obra,
      id_responsable: null,
    });
    setErrors({});
    setEditingIndex(null);
    setEditPagoId(undefined);
  };

  const handleAddPago = async () => {
    if (!validateForm()) {
      message.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await addPago(newPago);
      await loadData();
      message.success("Pago agregado exitosamente.");

      const currentYear = dayjs(newPago.fecha_pago).year().toString();
      const currentFilters: FiltroValues = {
        year: currentYear,
        fechaInicio: dayjs(newPago.fecha_pago).startOf("year").format("YYYY-MM-DD"),
        fechaFin: dayjs(newPago.fecha_pago).endOf("year").format("YYYY-MM-DD"),
        concepto: "",
        beneficiario: [],
      };

      handleFilterChange(currentFilters);
      window.dispatchEvent(new CustomEvent("pagosUpdated"));
    } catch (error: any) {
      console.error("❌ [handleAddPago] Error al agregar pago:", error);
      message.error(`Error al agregar el pago: ${error.message}`);
    } finally {
      resetFormState();
    }
  };

  const handleUpdatePago = async () => {
    if (editingIndex === null || !editPagoId) {
      message.error("No se seleccionÃ³ un pago para actualizar.");
      return;
    }
  
    if (!validateForm()) {
      message.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const pagoData: Pago = {
      id_pago: editPagoId,
      concepto: newPago.concepto,
      id_tipo_gasto: newPago.id_tipo_gasto,
      es_reembolsable: newPago.es_reembolsable,
      id_estado_reembolso: newPago.id_estado_reembolso,
      monto_pagado: newPago.monto_pagado,
      fecha_pago: newPago.fecha_pago,
      id_beneficiario: newPago.id_beneficiario,
      id_responsable: newPago.id_responsable,
      id_obra: id_obra,
      documentos: [],
    };
  
    try {
      await updatePago(pagoData);
      await loadData();
      message.success("Pago actualizado exitosamente.");
      setShouldReloadData(true);
      window.dispatchEvent(new CustomEvent("pagosUpdated"));
    } catch (error: any) {
      console.error("[handleUpdatePago] Error al actualizar el pago:", error);
      message.error(`Error al actualizar el pago: ${error.message}`);
      setShouldReloadData(true);
    } finally {
      resetFormState();
    }
  };

  const handleDeletePago = async () => {
    if (deleteIndex === null || !filteredPagos[deleteIndex].id_pago) {
      message.error("No se seleccionÃ³ un pago para eliminar.");
      return;
    }

    try {
      const pagoEliminado = filteredPagos[deleteIndex];
      await deletePago(pagoEliminado.id_pago);
      setShouldReloadData(true);
      setShowDeleteModal(false);
      setDeleteIndex(null);
      message.success("Pago eliminado exitosamente.");
      window.dispatchEvent(new CustomEvent("pagosUpdated"));
    } catch (error: any) {
      console.error("[handleDeletePago] Error al eliminar el pago:", error);
      message.error(`Error al eliminar el pago: ${error.message}`);
      setShouldReloadData(true);
    }
  };

  const handleOpenUploadModal = (pago: Pago) => {
    if (!pago.id_pago || isNaN(pago.id_pago) || pago.id_pago <= 0) {
      console.error("[handleOpenUploadModal] ID de pago invÃ¡lido:", pago.id_pago);
      message.error("No se puede abrir el modal: ID de pago invÃ¡lido.");
      return;
    }
    setEditPagoId(pago.id_pago);
    setModalUploadOpen(true);
  };

  const handleDocumentsSaved = async (nuevosDocumentos: { file: File; url: string; id: number }[]) => {
    try {
      if (!editPagoId || editPagoId <= 0) {
        throw new Error(
          `No se especificÃ³ un ID de pago vÃ¡lido para asociar los documentos: ${editPagoId}`
        );
      }
      await loadData();
      setModalUploadOpen(false);
      setEditPagoId(undefined);
      message.success("Documentos guardados exitosamente.");
      window.dispatchEvent(new CustomEvent("pagosUpdated"));
    } catch (error: any) {
      console.error("[handleDocumentsSaved] Error al manejar documentos guardados:", error);
      message.error(`Error al procesar los documentos: ${error.message}`);
      await loadData();
    }
  };

  const handleRemoveDocument = async (index: number) => {
    if (!editPagoId || !fileUrls[index]) {
      message.error("No se puede eliminar el documento: informaciÃ³n incompleta.");
      return;
    }

    const documentId = fileUrls[index].id;
    if (!documentId) {
      message.error("ID del documento no vÃ¡lido.");
      return;
    }

    try {
      // AquÃ­ deberÃ­as llamar a tu servicio de eliminaciÃ³n de documentos
      await apiClient.delete(`/archivosdelete/${documentId}`, {
        params: {
          codigo_registro: editPagoId,
          id_obra,
        },
      });
      await loadData();
      setFileUrls((prev) => prev.filter((_, i) => i !== index));
      if (fileUrls.length <= 1) {
        setModalOpen(false);
      }
      message.success("Documento eliminado exitosamente.");
      window.dispatchEvent(new CustomEvent("pagosUpdated"));
    } catch (error: any) {
      console.error("[handleRemoveDocument] Error al eliminar el documento:", error);
      message.error(`Error al eliminar el documento: ${error.message}`);
      await loadData();
    }
  };

  const columns: TableColumn<Pago>[] = [
    {
      name: "Concepto de Pago",
      selector: (row) => row.concepto,
      sortable: true,
      cell: (row) => (
        <Tooltip title={row.concepto}>
          <span style={{ 
            display: "inline-block", 
            maxWidth: "150px", 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis" 
          }}>
            {row.concepto}
          </span>
        </Tooltip>
      ),
    },
    {
      name: "Beneficiario",
      selector: (row) => {
        const beneficiario = beneficiarios.find(b => b.id_beneficiario === row.id_beneficiario);
        return beneficiario?.nombre || "Sin Asignar";
      },
      sortable: true,
    },
    { name: "Fecha", selector: (row) => formatDate(row.fecha_pago), sortable: true },
    {
      name: "Monto Pagado",
      selector: (row) => formatCurrency(row.monto_pagado),
      sortable: true,
    },
    {
      name: "Tipo de Gasto",
      selector: (row) => {
        return row.tipo_gasto?.nombre || "Desconocido";
      },
      sortable: true,
    },
    {
      name: "Reembolsable",
      cell: (row) => (
        <span>{row.es_reembolsable ? "Si" : "No"}</span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Estado de Reembolso",
      cell: (row, index) => (
        <Select
          value={row.id_estado_reembolso}
          onChange={async (value) => {
            try {
              const pagoActualizado: Pago = {
                ...row,
                id_estado_reembolso: value as number,
              };
              await updatePago(pagoActualizado);
              setShouldReloadData(true);
              message.success("Estado de reembolso actualizado.");
              window.dispatchEvent(new CustomEvent("pagosUpdated"));
            } catch (error: any) {
              console.error("[handleEstadoReembolsoChange] Error:", error);
              message.error(`Error al actualizar el estado: ${error.message}`);
              setShouldReloadData(true);
            }
          }}
          style={{ width: "100%", fontWeight: "normal" }}
          placeholder="Seleccionar"
        >
          {estadosReembolso.map((estado) => (
            <Option key={estado.id_estado_reembolso} value={estado.id_estado_reembolso}>
              {estado.nombre}
            </Option>
          ))}
        </Select>
      ),
      sortable: true,
    },
    {
      name: "Responsable",
      cell: (row) => {
        const responsable = responsables.find(r => r.id_responsable === row.id_responsable);
        return <InitialsIcon name={responsable?.nombre || "Sin Asignar"} />;
      },
      selector: (row) => {
        const responsable = responsables.find(r => r.id_responsable === row.id_responsable);
        return responsable?.nombre || "Sin Asignar";
      },
      sortable: true,
      center: true,
    },
    {
      name: "Documentos",
      center: true,
      cell: (row) => {
        const handleDocumentSelect = () => {
          setFileUrls(row.documentos || []);
          setEditPagoId(row.id_pago);
          setModalOpen(true);
        };

        const documentMenu = (
          <Menu>
            {row.documentos?.map((doc) => (
              <Menu.Item
                key={doc.id}
                onClick={handleDocumentSelect}
                style={{
                  fontSize: "14px",
                  color: "#333",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.nombre_original}
              </Menu.Item>
            ))}
          </Menu>
        );

        return (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {row.documentos && row.documentos.length > 0 ? (
              <Dropdown overlay={documentMenu} trigger={["click"]}>
                <button
                  style={{
                    background: "#4CAF50",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px",
                    cursor: "pointer",
                  }}
                >
                  <FaPaperclip size={14} color="white" />
                </button>
              </Dropdown>
            ) : null}
            <button
              onClick={() => handleOpenUploadModal(row)}
              style={{
                background: "transparent",
                border: "1px solid #C4C4C4",
                borderRadius: "4px",
                padding: "4px",
                cursor: "pointer",
              }}
            >
              <FaFileUpload size={14} color="#C4C4C4" />
            </button>
          </div>
        );
      },
    },
    {
      name: "Opciones",
      center: true,
      cell: (row, rowIndex) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Editar" placement="left" color="rgba(85, 85, 85, 0.8)">
            <IconButton onClick={() => handleEditPago(rowIndex)}>
              <FaEdit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" placement="left" color="rgba(85, 85, 85, 0.8)">
            <IconButton onClick={() => handleOpenDeleteModal(rowIndex)}>
              <FaTrash size={14} color="#868686" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const porcentajeReembolsado = montoPagado > 0 ? (montoReembolsado / montoPagado) * 100 : 0;
  const porcentajeFormateado = porcentajeReembolsado.toFixed(2);

  const tipoSeleccionado = tiposGasto.find(t => t.id === newPago.id_tipo_gasto);
  const isCheckboxDisabled = tipoSeleccionado?.nombre.toLowerCase() === "administrativo";

  return (
    <>
      <PagosContainer>
        <FiltroWrapper isCollapsed={isFiltroCollapsed}>
          <FiltroPagos
            onFilterChange={handleFilterChange}
            beneficiarios={beneficiarios.map((b) => b.nombre.toLowerCase())}
            id_obra={id_obra}
            setIsCollapsed={setIsFiltroCollapsed}
            isCollapsed={isFiltroCollapsed}
          />
        </FiltroWrapper>

        <ContentWrapper isCollapsed={isFiltroCollapsed}>
          <Header>
            <MontosContainer isCollapsed={isFiltroCollapsed}>
              <MontoContainer>
                <Monto color="#722AE9">{formatCurrency(montoPagado)}</Monto>
                <span>Monto pagado</span>
              </MontoContainer>
              <MontoContainer>
                <Monto color="#722AE9">{formatCurrency(montoReembolsado)} ({porcentajeFormateado}%)</Monto>
                <span>Monto reembolsado</span>
              </MontoContainer>
              <MontoContainer>
                <MontoWrapper>
                  <Monto color="#722AE9">{getCostoProyecto(id_obra)}</Monto>
                  <IconButton onClick={handleOpenModal}>
                    <FaEdit />
                  </IconButton>
                </MontoWrapper>
                <span>Costo del proyecto</span>
              </MontoContainer>
            </MontosContainer>
          </Header>

          <FlexContainer>
            <TableWrapper isCollapsed={isFiltroCollapsed}>
              {showForm ? (
                <FormContainer
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Input
                    placeholder="Concepto de Pago"
                    value={newPago.concepto}
                    onChange={(e) => handleInputChange("concepto", e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      maxWidth: "300px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.concepto ? "1px solid red" : undefined,
                    }}
                  />
                  <Select
                    showSearch
                    placeholder="Beneficiario"
                    value={newPago.id_beneficiario || undefined}
                    onChange={(value) => handleInputChange("id_beneficiario", value)}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      maxWidth: "250px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.id_beneficiario ? "1px solid red" : undefined,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option?.children
                        ? (option.children as unknown as string)
                            .toLowerCase()
                            .startsWith(input.toLowerCase())
                        : false
                    }
                  >
                    {beneficiarios.map((beneficiario) => (
                      <Option key={beneficiario.id_beneficiario} value={beneficiario.id_beneficiario}>
                        {beneficiario.nombre}
                      </Option>
                    ))}
                  </Select>
                  <DatePicker
                    placeholder="Fecha"
                    value={newPago.fecha_pago ? dayjs(newPago.fecha_pago) : null}
                    onChange={(date) => handleInputChange("fecha_pago", date)}
                    format="DD/MM/YYYY"
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      maxWidth: "120px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.fecha_pago ? "1px solid red" : undefined,
                    }}
                  />
                  <Input
                    placeholder="Monto"
                    value={newPago.monto_pagado}
                    onChange={(e) => handleInputChange("monto_pagado", e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: "80px",
                      maxWidth: "100px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.monto_pagado ? "1px solid red" : undefined,
                    }}
                    type="number"
                  />
                  <Select
                    placeholder="Tipo de Gasto"
                    value={newPago.id_tipo_gasto}
                    onChange={(value) => handleInputChange("id_tipo_gasto", value)}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      maxWidth: "250px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.id_tipo_gasto ? "1px solid red" : undefined,
                    }}
                  >
                    {tiposGasto.map((tipo) => (
                      <Option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </Option>
                    ))}
                  </Select>

                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Checkbox
                      checked={newPago.es_reembolsable}
                      onChange={(e) => handleInputChange("es_reembolsable", e.target.checked)}
                      disabled={isCheckboxDisabled}
                    >
                      Reembolsable
                    </Checkbox>
                  </div>

                  <Select
                    showSearch
                    placeholder="Responsable"
                    value={newPago.id_responsable || undefined}
                    onChange={(value) => handleInputChange("id_responsable", value)}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      maxWidth: "250px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.id_responsable ? "1px solid red" : undefined,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option?.children
                        ? (option.children as unknown as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        : false
                    }
                  >
                    {responsables.map((responsable) => (
                      <Option key={responsable.id_responsable} value={responsable.id_responsable}>
                        {responsable.nombre}
                      </Option>
                    ))}
                  </Select>
                  
                  <AddPagoButton
                    onClick={editingIndex === null ? handleAddPago : handleUpdatePago}
                    style={{ flex: "0 0 auto", minWidth: "100px" }}
                  >
                    {editingIndex === null ? "Agregar" : "Actualizar"}
                  </AddPagoButton>
                </FormContainer>
              ) : (
                <AddButton onClick={() => setShowForm(true)}>
                  <span>+ Nuevo Pago</span>
                </AddButton>
              )}
              <DataTableCustom
                title=""
                columns={columns}
                data={rows || []}
                totalRows={rowsTotal}
                currentPage={currentPage}
                rowsPerPage={rowsPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                emptyText="No hay pagos disponibles"
                stickyColumns
              />
            </TableWrapper>
          </FlexContainer>
        </ContentWrapper>
      </PagosContainer>

      {showEditModal && (
        <ModalOverlay style={{ zIndex: 1000 }}>
          <ModalContent>
            <ModalHeader>
              Monto Planificado
              <CloseButton onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Label>Monto Planificado</Label>
              <InputMonto
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Monto Planificado"
                style={{ fontWeight: "normal" }}
              />
            </ModalBody>
            <ButtonContainer>
              <SaveButton onClick={handleSaveMonto}>Guardar</SaveButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      {modalOpen && (
        <ModalVistaPrevia
          visible={modalOpen}
          files={fileUrls}
          onClose={() => {
            setModalOpen(false);
            setFileUrls([]);
            setEditPagoId(undefined);
          }}
          onRemoveFile={handleRemoveDocument}
        />
      )}

      {modalUploadOpen && editPagoId && (
        <ModalOverlay style={{ zIndex: 1000 }}>
          <ModalDocumento
            categoria="Documento"
            tipo="pago"
            actividadId={editPagoId}
            carpetaBase={CARPETA_PAGOS}
            onClose={() => {
              setModalUploadOpen(false);
              setEditPagoId(undefined);
            }}
            onDocumentsSaved={handleDocumentsSaved}
            codigoRegistro={editPagoId}
            id_obra={id_obra}
          />
        </ModalOverlay>
      )}

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ModalEliminar
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeletePago}
            mensaje="Estas seguro de eliminar este pago?"
          />
        </div>
      )}
    </>
  );
};

export default Pagos;