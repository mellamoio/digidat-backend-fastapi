import type { TableColumn } from "react-data-table-component";
import { FaFileUpload, FaTimes, FaEdit, FaTrash, FaPaperclip } from "react-icons/fa";
import { Tooltip, message, Input, DatePicker, Dropdown, Menu, Select } from "antd";
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
import { fetchPagos, addPago, updatePago, deletePago, updatePagoEstado, deletePagoDocumento } from "../../../services/getPagos.service";
import { userService } from "../../../services/getUser.service";
import apiClient from "../../../api/api";
import dayjs from "dayjs";
import type {
  Pago,
  TipoGasto,
  EstadoReembolso,
  FileObject,
  Responsable,
  FiltroValues, 
  NewPago,
  Obra,
} from "../../../types/pagos";
import { DataTableCustom } from "../../../components/DataTableCustom";
import { useSatelite } from "../../../context/DigidatContext";
import { usePagination } from "../../../hooks/usePagination";

const { Option } = Select;

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
  const { tiposGastoData } = useSatelite();
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
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [beneficiarios, setBeneficiarios] = useState<{ id: number; nombre: string }[]>([]);
  const [gruposInteres, setGruposInteres] = useState<{ id: number; nombre: string }[]>([]);
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
    { id: 1, nombre: "Reembolsado" },
    { id: 2, nombre: "No Reembolsado" },
  ]);
  const [refresh, setRefresh] = useState(0);
  const [errors, setErrors] = useState<{
    concepto?: boolean;
    beneficiario?: boolean;
    grupo_interes?: boolean;
    fecha?: boolean;
    monto_pagado?: boolean;
    id_tipo_gasto?: boolean;
    id_estado_rembolso?: boolean;
    id_responsable?: boolean;
    id_obra?: boolean;
  }>({});

  useEffect(() => {
    if (tiposGastoData) {
      setTiposGasto(tiposGastoData);
      setNewPago((prev) => ({
        ...prev,
        id_tipo_gasto: tiposGastoData[0]?.id || 1,
      }));
    } else {
      setTiposGasto([
        { id: 1, name: "Administrativo" },
        { id: 2, name: "Reembolsable" },
      ]);
    }
  }, [tiposGastoData]);

  const [newPago, setNewPago] = useState<NewPago>({
    concepto: "",
    beneficiario: [{ id: 1, nombre: "" }],
    fecha: "",
    monto_pagado: "",
    id_tipo_gasto: tiposGasto[0]?.id || 1,
    id_estado_rembolso: 2,
    id_obra: id_obra,
    id_responsable: undefined,
  });

  const calculateTotals = (pagosList: Pago[]) => {
    let totalPagado = 0;
    let totalReembolsado = 0;
    pagosList.forEach((pago: Pago) => {
      const monto = Number(pago.monto_pagado) || 0;
      totalPagado += monto;
      if (pago.id_estado_rembolso === 1) {
        totalReembolsado += monto;
      }
    });
    setMontoPagado(totalPagado);
    setMontoReembolsado(totalReembolsado);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const obrasResponse = await apiClient.get("/all/obraporimpuesto", {
      });
      const fetchedObras = obrasResponse.data.data || [];
      setObras(fetchedObras);

      const fetchedPagos = await fetchPagos(id_obra);

      const validPagos = fetchedPagos.filter((pago: any) => {
        const isValid =
          pago &&
          typeof pago === "object" &&
          pago.id &&
          !isNaN(pago.id) &&
          pago.id > 0 &&
          pago.monto_pagado !== undefined &&
          pago.id_obra === id_obra;
        if (!isValid) {
          console.warn("[loadData] Invalid pago object:", pago);
        }
        return isValid;
      });

      const normalizedPagos = await Promise.all(
        validPagos.map(async (pago: any) => {
          const documentos = await getDocumentosPorActividad(pago.id);
          return {
            ...pago,
            id: Number(pago.id),
            monto_pagado: parseFloat(pago.monto_pagado) || 0,
            documentos: documentos.length > 0 ? documentos : [],
            beneficiario: pago.beneficiario
              ? typeof pago.beneficiario === "string"
                ? JSON.parse(pago.beneficiario).map((b: any) => ({
                    id: Number(b?.id) || 1,
                    nombre: b?.nombre || "",
                  }))
                : Array.isArray(pago.beneficiario) && pago.beneficiario.length > 0
                ? pago.beneficiario.map((b: any) => ({
                    id: Number(b?.id) || 1,
                    nombre: b?.nombre || "",
                  }))
                : [{ id: 1, nombre: "" }]
              : [{ id: 1, nombre: "" }],
            grupo_interes: pago.grupo_interes
              ? typeof pago.grupo_interes === "string"
                ? JSON.parse(pago.grupo_interes).map((g: any) => ({
                    id: Number(g?.id) || 1,
                    nombre: g?.nombre || "Sin Asignar",
                  }))
                : Array.isArray(pago.grupo_interes) && pago.grupo_interes.length > 0
                ? pago.grupo_interes.map((g: any) => ({
                    id: Number(g?.id) || 1,
                    nombre: g?.nombre || "Sin Asignar",
                  }))
                : [{ id: 1, nombre: "Sin Asignar" }]
              : [{ id: 1, nombre: "Sin Asignar" }],
            responsables: pago.responsables
              ? typeof pago.responsables === "string"
                ? JSON.parse(pago.responsables).map((r: any) => ({
                    id: Number(r?.id) || 0,
                    nombre: r?.nombre || r?.nombres || "Sin Asignar",
                  }))
                : Array.isArray(pago.responsables) && pago.responsables.length > 0
                ? pago.responsables.map((r: any) => ({
                    id: Number(r?.id) || 0,
                    nombre: r?.nombre || r?.nombres || "Sin Asignar",
                  }))
                : [{ id: 0, nombre: "Sin Asignar" }]
              : [{ id: 0, nombre: "Sin Asignar" }],
            id_obra: id_obra,
            id_tipo_gasto: Number(pago.id_tipo_gasto) || (pago.tipo_gasto?.id ? Number(pago.tipo_gasto.id) : tiposGasto[0]?.id || 1),
            id_estado_rembolso: Number(pago.id_estado_rembolso) || 2,
          };
        })
      );

      const sortedPagos = normalizedPagos.sort((a, b) => Number(b.id) - Number(a.id));

      setPagos(sortedPagos);
      setFilteredPagos(sortedPagos);

      const fetchedBeneficiarios = await userService.getUsers();
      const beneficiariosConverted = fetchedBeneficiarios.map((beneficiario: any) => {
        const nombreCompleto = beneficiario.nombre || 
          (beneficiario.nombres && beneficiario.apellidos 
            ? `${beneficiario.nombres} ${beneficiario.apellidos}` 
            : beneficiario.nombres || "Sin Nombre");
        return {
          id: parseInt(beneficiario.id),
          nombre: nombreCompleto.trim(),
        };
      });
      setBeneficiarios(beneficiariosConverted);

      const fetchedResponsables = await userService.getUsers();
      const responsablesConverted = fetchedResponsables.map((responsable: any) => ({
        ...responsable,
        id: parseInt(responsable.id),
        nombres: responsable.nombres || "Sin Asignar",
      }));
      setResponsables(responsablesConverted);

      calculateTotals(sortedPagos);
    } catch (error: any) {
      console.error("[loadData] Error al cargar datos:", error);
      if (error.response?.status === 403) {
        message.error("Acceso denegado: No tienes permisos para ver las obras.");
      } else {
        message.error(`Error al cargar datos: ${error.message}`);
      }
      setPagos([]);
      setFilteredPagos([]);
      setObras([]);
      setResponsables([]);
      setBeneficiarios([]);
      setGruposInteres([]);
    } finally {
      setLoading(false);
      setShouldReloadData(false);
    }
  }, [id_obra, tiposGasto]);

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
    const obra = obras.find((o) => o.id === obraId);
    return obra ? formatCurrency(obra.costo_proyecto) : "S/. 0.00";
  };

  const handleFilterChange = (filters: FiltroValues) => {
    const { year, fechaInicio, fechaFin, concepto, beneficiario } = filters;
    let filtered = [...pagos].filter((pago) => pago.id_obra === id_obra);
  
    if (year) {
      filtered = filtered.filter((pago) => new Date(pago.fecha).getFullYear().toString() === year);
    }
  
    if (fechaInicio && fechaFin) {
      filtered = filtered.filter((pago) => {
        const pagoFecha = dayjs(pago.fecha);
        const inicio = dayjs(fechaInicio);
        const fin = dayjs(fechaFin);
        return pagoFecha.isAfter(inicio, "day") && pagoFecha.isBefore(fin, "day");
      });
    }
  
    if (concepto) {
      filtered = filtered.filter((pago) => pago.concepto.toLowerCase().includes(concepto.toLowerCase()));
    }
  
    if (beneficiario && beneficiario.length > 0) {
      filtered = filtered.filter((pago) =>
        pago.beneficiario.some((b) =>
          beneficiario.includes(b.nombre.toLowerCase())
        )
      );
    }
  
    filtered = filtered.sort((a, b) => Number(b.id) - Number(a.id));
  
    setFilteredPagos(filtered);
    calculateTotals(filtered);
  };

  const handleEstadoReembolsoChange = async (index: number, estadoId: number) => {
    const pago = filteredPagos[index];
    if (!pago.id) {
      message.error("ID del pago no disponible.");
      return;
    }

    try {
      await updatePagoEstado(pago.id, estadoId, id_obra);
      setShouldReloadData(true);
      message.success("Estado de reembolso actualizado.");
      window.dispatchEvent(new CustomEvent("pagosUpdated"));
    } catch (error: any) {
      console.error("[handleEstadoReembolsoChange] Error al actualizar estado:", error);
      message.error(`Error al actualizar el estado de reembolso: ${error.message}`);
      setShouldReloadData(true);
    }
  };

  const handleEditPago = (index: number) => {
    const pago = filteredPagos[index];
    if (!pago.id) {
      message.error("ID del pago no disponible para edición.");
      return;
    }
    setEditingIndex(index);
    setEditPagoId(pago.id);
    setNewPago({
      concepto: pago.concepto || "",
      beneficiario: pago.beneficiario?.length > 0 ? pago.beneficiario : [{ id: 1, nombre: "" }],
      fecha: pago.fecha || "",
      monto_pagado: pago.monto_pagado ? pago.monto_pagado.toString() : "",
      id_tipo_gasto: pago.id_tipo_gasto || tiposGasto[0]?.id || 1,
      id_estado_rembolso: pago.id_estado_rembolso || 2,
      id_obra: id_obra,
      id_responsable: pago.responsables?.[0]?.id !== undefined && pago.responsables?.[0]?.id !== 0
        ? pago.responsables[0].id
        : undefined,
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
      message.error("Por favor, ingrese un monto válido.");
      return;
    }
    const formattedMonto = formatCurrency(numericValue);
    localStorage.setItem(`costoProyecto_${id_obra}`, formattedMonto);
    setShowEditModal(false);
    message.success("Costo del proyecto actualizado correctamente.");
  };

  const handleInputChange = (name: string, value: string | number | dayjs.Dayjs | undefined) => {
    setNewPago((prev) => {
      if (name === "beneficiario[0].nombre" && typeof value === "string") {
        const selectedBeneficiario = beneficiarios.find((b) => b.nombre === value);
        return {
          ...prev,
          beneficiario: selectedBeneficiario
            ? [{ id: selectedBeneficiario.id, nombre: selectedBeneficiario.nombre }]
            : [{ id: 1, nombre: "" }],
        };
      }
      if (name === "grupo_interes[0].nombre" && typeof value === "string") {
        const selectedGrupo = gruposInteres.find((g) => g.nombre === value);
        return {
          ...prev,
          grupo_interes: selectedGrupo
            ? [{ id: selectedGrupo.id, nombre: selectedGrupo.nombre }]
            : [{ id: 1, nombre: "" }],
        };
      }
      return {
        ...prev,
        ...(name === "concepto" && { concepto: (value as string) || "" }),
        ...(name === "fecha" && {
          fecha: value ? dayjs(value).format("YYYY-MM-DD") : "",
        }),
        ...(name === "monto_pagado" && { monto_pagado: (value as string) || "" }),
        ...(name === "id_tipo_gasto" && { id_tipo_gasto: value as number }),
        ...(name === "id_estado_rembolso" && { id_estado_rembolso: value as number }),
        ...(name === "id_responsable" && {
          id_responsable: value === null || value === undefined ? undefined : (value as number),
        }),
        id_obra: id_obra,
      };
    });
    setErrors((prev) => ({ ...prev, [name.split("[")[0]]: false }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!newPago.concepto.trim()) newErrors.concepto = true;
    if (!newPago.beneficiario?.[0]?.nombre.trim()) newErrors.beneficiario = true;
    if (!newPago.fecha) newErrors.fecha = true;
    if (
      !newPago.monto_pagado ||
      isNaN(parseFloat(newPago.monto_pagado)) ||
      parseFloat(newPago.monto_pagado) <= 0
    )
      newErrors.monto_pagado = true;
    if (!newPago.id_tipo_gasto) newErrors.id_tipo_gasto = true;
    if (!newPago.id_estado_rembolso) newErrors.id_estado_rembolso = true;
    if (!newPago.id_obra) newErrors.id_obra = true;
    if (newPago.id_responsable === undefined) newErrors.id_responsable = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFormState = () => {
    setShowForm(false);
    setNewPago({
      concepto: "",
      beneficiario: [{ id: 1, nombre: "" }],
      fecha: "",
      monto_pagado: "",
      id_tipo_gasto: tiposGasto[0]?.id || 1,
      id_estado_rembolso: 2,
      id_obra: id_obra,
      id_responsable: undefined,
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

    const montoNumerico = parseFloat(newPago.monto_pagado.replace(/[^0-9.]/g, ""));
    const responsableSeleccionado = responsables.find((r) => r.id === newPago.id_responsable);
    if (!responsableSeleccionado || !responsableSeleccionado.nombres) {
      message.error("Responsable no encontrado o sin nombre.");
      return;
    }

    const tipoGastoSeleccionado = tiposGasto.find((t) => t.id === newPago.id_tipo_gasto);
    if (!tipoGastoSeleccionado) {
      message.error("Tipo de gasto inválido.");
      return;
    }

    const pagoData: Omit<Pago, "id"> = {
      concepto: newPago.concepto,
      id_tipo_gasto: newPago.id_tipo_gasto,
      id_estado_rembolso: newPago.id_estado_rembolso || 2,
      monto_pagado: montoNumerico,
      fecha: newPago.fecha,
      beneficiario: newPago.beneficiario,
      responsables: [
        {
          id: responsableSeleccionado.id,
          nombre: responsableSeleccionado.nombres,
        },
      ],
      id_obra: id_obra,
      documentos: [],
    };

    try {
      const newPagoResponse = await addPago(pagoData);
      const normalizedNewPago: Pago = {
        ...newPagoResponse,
        id: Number(newPagoResponse.id),
        monto_pagado: newPagoResponse.monto_pagado || 0,
        documentos: newPagoResponse.documentos || [],
        beneficiario: newPagoResponse.beneficiario || [{ id: 1, nombre: "" }],
        responsables: newPagoResponse.responsables || [{ id: 0, nombre: "Sin Asignar" }],
        id_obra: id_obra,
        id_tipo_gasto: Number(newPagoResponse.id_tipo_gasto) || tiposGasto[0]?.id || 1,
        id_estado_rembolso: Number(newPagoResponse.id_estado_rembolso) || 2,
      };

      setPagos((prev) => [normalizedNewPago, ...prev]);
      setFilteredPagos((prev) => [normalizedNewPago, ...prev]);
      calculateTotals([normalizedNewPago, ...pagos]);
      message.success("Pago agregado exitosamente.");
    } catch (error: any) {
      console.error("[handleAddPago] Error al agregar pago:", error);
      message.error(`Error al agregar el pago: ${error.message}`);
      setShouldReloadData(true);
    } finally {
      resetFormState();
    }
  };

  const handleUpdatePago = async () => {
    if (editingIndex === null || !editPagoId) {
      message.error("No se seleccionó un pago para actualizar.");
      return;
    }
  
    if (!validateForm()) {
      message.error("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    const montoNumerico = parseFloat(newPago.monto_pagado.replace(/[^0-9.]/g, ""));
    const responsableSeleccionado = responsables.find((r) => r.id === newPago.id_responsable);
    if (!responsableSeleccionado || !responsableSeleccionado.nombres) {
      message.error("Responsable no encontrado o sin nombre.");
      return;
    }
  
    const tipoGastoSeleccionado = tiposGasto.find((t) => t.id === newPago.id_tipo_gasto);
    if (!tipoGastoSeleccionado) {
      message.error("Tipo de gasto inválido.");
      return;
    }
  
    const existingDocuments = pagos.find((p) => p.id === editPagoId)?.documentos || [];
    const pagoData: Pago = {
      id: editPagoId,
      concepto: newPago.concepto,
      id_tipo_gasto: newPago.id_tipo_gasto,
      id_estado_rembolso: newPago.id_estado_rembolso,
      monto_pagado: montoNumerico,
      fecha: newPago.fecha,
      beneficiario: newPago.beneficiario,
      responsables: [
        {
          id: responsableSeleccionado.id,
          nombre: responsableSeleccionado.nombres,
        },
      ],
      id_obra: id_obra,
      documentos: existingDocuments,
    };
  
    try {
      const updatedPago = await updatePago(pagoData);
      const normalizedUpdatedPago: Pago = {
        ...updatedPago,
        id: Number(updatedPago.id),
        monto_pagado: updatedPago.monto_pagado || 0,
        documentos: updatedPago.documentos || [],
        beneficiario: updatedPago.beneficiario
          ? typeof updatedPago.beneficiario === "string"
            ? JSON.parse(updatedPago.beneficiario).map((b: any) => ({
                id: Number(b?.id) || 1,
                nombre: b?.nombre || "",
              }))
            : Array.isArray(updatedPago.beneficiario) && updatedPago.beneficiario.length > 0
            ? updatedPago.beneficiario.map((b: any) => ({
                id: Number(b?.id) || 1,
                nombre: b?.nombre || "",
              }))
            : [{ id: 1, nombre: "" }]
          : [{ id: 1, nombre: "" }],
        responsables: updatedPago.responsables
          ? typeof updatedPago.responsables === "string"
            ? JSON.parse(updatedPago.responsables).map((r: any) => ({
                id: Number(r?.id) || 0,
                nombre: r?.nombre || r?.nombres || "Sin Asignar",
              }))
            : Array.isArray(updatedPago.responsables) && updatedPago.responsables.length > 0
            ? updatedPago.responsables.map((r: any) => ({
                id: Number(r?.id) || 0,
                nombre: r?.nombre || r?.nombres || "Sin Asignar",
              }))
            : [{ id: 0, nombre: "Sin Asignar" }]
          : [{ id: 0, nombre: "Sin Asignar" }],
        id_obra: id_obra,
        id_tipo_gasto: Number(updatedPago.id_tipo_gasto) || tiposGasto[0]?.id || 1,
        id_estado_rembolso: Number(updatedPago.id_estado_rembolso) || 2,
      };
  
      setPagos((prev) =>
        prev.map((p) => (p.id === normalizedUpdatedPago.id ? normalizedUpdatedPago : p))
      );
      setFilteredPagos((prev) =>
        prev.map((p) => (p.id === normalizedUpdatedPago.id ? normalizedUpdatedPago : p))
      );
      calculateTotals(pagos.map((p) => (p.id === normalizedUpdatedPago.id ? normalizedUpdatedPago : p)));
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
    if (deleteIndex === null || !filteredPagos[deleteIndex].id) {
      message.error("No se seleccionó un pago para eliminar.");
      return;
    }

    try {
      const pagoEliminado = filteredPagos[deleteIndex];
      await deletePago(pagoEliminado.id, id_obra);

      if (pagoEliminado.documentos && pagoEliminado.documentos.length > 0) {
        for (const doc of pagoEliminado.documentos) {
          if (!doc.id) {
            console.warn(
              `[handleDeletePago] Documento sin ID válido para pago ${pagoEliminado.id}:`,
              doc
            );
            continue;
          }
          try {
            await deletePagoDocumento(
              Number(doc.id),
              pagoEliminado.id,
              id_obra,
            );
          } catch (error: any) {
            console.error(
              `[handleDeletePago] Error al eliminar documento ${doc.id} para pago ${pagoEliminado.id}:`,
              error
            );
          }
        }
      }

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
    if (!pago.id || isNaN(pago.id) || pago.id <= 0) {
      console.error("[handleOpenUploadModal] ID de pago inválido:", pago.id);
      message.error("No se puede abrir el modal: ID de pago inválido.");
      return;
    }
    setEditPagoId(pago.id);
    setModalUploadOpen(true);
  };

  const handleDocumentsSaved = async (nuevosDocumentos: { file: File; url: string; id: number }[]) => {
    try {
      if (!editPagoId || editPagoId <= 0) {
        throw new Error(
          `No se especificó un ID de pago válido para asociar los documentos: ${editPagoId}`
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
      message.error("No se puede eliminar el documento: información incompleta.");
      return;
    }

    const documentId = fileUrls[index].id;
    if (!documentId) {
      message.error("ID del documento no válido.");
      return;
    }

    try {
      await deletePagoDocumento(Number(documentId), editPagoId, id_obra);
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
        const beneficiarios = row.beneficiario || [];
        return beneficiarios.length > 0
          ? beneficiarios
              .map((b) => b.nombre || "Sin Nombre")
              .filter((nombre) => nombre)
              .join(", ")
          : "Sin Asignar";
      },
      sortable: true,
    },
    
    { name: "Fecha", selector: (row) => formatDate(row.fecha), sortable: true },
    {
      name: "Monto Pagado",
      selector: (row) => formatCurrency(row.monto_pagado),
      sortable: true,
    },
    {
      name: "Tipo de Gasto",
      selector: (row) => {
        const tipo = tiposGasto.find((t) => t.id === row.id_tipo_gasto);
        return tipo ? tipo.name : `Desconocido (${row.id_tipo_gasto})`;
      },
      sortable: true,
    },
    {
      name: "Estado de Reembolso",
      cell: (row, index) => (
        <Select
          value={row.id_estado_rembolso}
          onChange={(value) => handleEstadoReembolsoChange(index, value as number)}
          style={{ width: "100%", fontWeight: "normal" }}
          placeholder="Seleccionar"
        >
          {estadosReembolso.map((estado) => (
            <Option key={estado.id} value={estado.id}>
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
        const responsable = row.responsables?.[0];   
        return <InitialsIcon name={responsable?.nombre || "Sin Asignar"} />;
      },
      selector: (row) => {
        const nombre = row.responsables?.[0]?.nombre || "Sin Asignar";
        return nombre;
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
          setEditPagoId(row.id);
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

  // Depuración: Verificar los datos de beneficiarios y gruposInteres
  console.log("Beneficiarios:", beneficiarios);
  console.log("Grupos de Interés:", gruposInteres);

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
                    flexWrap: "nowrap",
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
                    value={newPago.beneficiario?.[0]?.nombre || undefined}
                    onChange={(value) => handleInputChange("beneficiario[0].nombre", value || "")}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      maxWidth: "250px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.beneficiario ? "1px solid red" : undefined,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option?.children
                        ? (option.children as unknown as string)
                            .toLowerCase()
                            .startsWith(input.toLowerCase())
                        : false
                    }
                    notFoundContent={
                      beneficiarios.length === 0 ? (
                        <div style={{ padding: "8px", textAlign: "center", color: "#888" }}>
                          No se encontraron beneficiarios
                        </div>
                      ) : null
                    }
                  >
                    {beneficiarios.map((beneficiario) => (
                      <Option key={beneficiario.id} value={beneficiario.nombre}>
                        {beneficiario.nombre}
                      </Option>
                    ))}
                  </Select>
                  <DatePicker
                    placeholder="Fecha"
                    value={newPago.fecha ? dayjs(newPago.fecha) : null}
                    onChange={(date) => handleInputChange("fecha", date)}
                    format="DD/MM/YYYY"
                    style={{
                      flex: 1,
                      minWidth: "100px",
                      maxWidth: "120px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.fecha ? "1px solid red" : undefined,
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
                        {tipo.name}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Estado"
                    value={newPago.id_estado_rembolso}
                    onChange={(value) => handleInputChange("id_estado_rembolso", value)}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      maxWidth: "250px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.id_estado_rembolso ? "1px solid red" : undefined,
                    }}
                  >
                    {estadosReembolso.map((estado) => (
                      <Option key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    placeholder="Responsable"
                    value={newPago.id_responsable !== undefined ? newPago.id_responsable : undefined}
                    onChange={(value) => handleInputChange("id_responsable", value === null ? undefined : value)}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      maxWidth: "250px",
                      height: "32px",
                      fontWeight: "normal",
                      border: errors.id_responsable ? "1px solid red" : undefined,
                    }}
                    allowClear
                  >
                    <Option value={undefined}>Seleccionar</Option>
                    {responsables.map((responsable) => (
                      <Option key={responsable.id} value={responsable.id}>
                        {responsable.nombres}
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
            mensaje="¿Estás seguro de eliminar este pago?"
          />
        </div>
      )}
    </>
  );
};

export default Pagos;