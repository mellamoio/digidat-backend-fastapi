import apiClient from "../api/api";
import type { Pago } from "../types/pagos";

interface PagoApiResponse {
  success: boolean;
  data: Pago[];
}

interface SinglePagoApiResponse {
  success?: boolean;
  data?: Pago | Pago[] | null | boolean;
  message?: string;
  id_obra?: number;
  id?: number;
}

const parseBeneficiarios = (beneficiario: any): Array<{ id: number; nombre: string }> => {
  if (!beneficiario) return [{ id: 1, nombre: "" }];
  
  let parsed = beneficiario;
  if (typeof beneficiario === "string") {
    try {
      parsed = JSON.parse(beneficiario);
    } catch (e) {
      return [{ id: 1, nombre: "" }];
    }
  }
  
  if (!Array.isArray(parsed)) return [{ id: 1, nombre: "" }];
  
  return parsed.map((b: any) => ({
    id: Number(b.id || b.id_beneficiario) || 1,
    nombre: b.nombre || "",
  }));
};

const parseResponsables = (responsables: any): Array<{ id: number; nombre: string }> => {
  if (!responsables) return [{ id: 0, nombre: "Sin Asignar" }];
  
  let parsed = responsables;
  if (typeof responsables === "string") {
    try {
      parsed = JSON.parse(responsables);
    } catch (e) {
      return [{ id: 0, nombre: "Sin Asignar" }];
    }
  }
  
  if (!Array.isArray(parsed)) return [{ id: 0, nombre: "Sin Asignar" }];
  
  return parsed.map((r: any) => ({
    id: Number(r.id) || 0,
    nombre: r.nombre || r.nombres || "Sin Asignar",
  }));
};

export const fetchPagos = async (idObraImpuesto?: number): Promise<Pago[]> => {
  if (!idObraImpuesto) { 
    console.error("[fetchPagos] El parámetro id_obra_impuesto es requerido.");
    throw new Error("El ID de la obra es requerido.");
  }

  try {
    const response = await apiClient.get<PagoApiResponse>("/all/pagosoi", {
      params: {
        id_obra: idObraImpuesto,
      },
    });
    const pagos = response.data?.data || [];

    return pagos.map((pago: any) => {
      const montoPagado = parseFloat(pago.monto_pagado);

      return {
        id: Number(pago.id) || 0,
        concepto: pago.concepto || "",
        beneficiario: parseBeneficiarios(pago.beneficiario),
        fecha: pago.fecha || "",
        monto_pagado: isNaN(montoPagado) ? 0 : montoPagado,
        id_tipo_gasto: Number(pago.id_tipo_gasto) || (pago.tipo_gasto?.id ? Number(pago.tipo_gasto.id) : 1),
        id_estado_rembolso: Number(pago.id_estado_rembolso) || 2,
        id_obra: Number(pago.id_obra) || idObraImpuesto,
        responsables: parseResponsables(pago.responsables),
        documentos: Array.isArray(pago.documentos) ? pago.documentos : [],
        tipo_gasto: pago.tipo_gasto
          ? {
              id: Number(pago.tipo_gasto.id) || 1,
              name: pago.tipo_gasto.name || "Desconocido",
            }
          : undefined,
      };
    });
  } catch (error: any) {
    console.error("[fetchPagos] Error al obtener pagos:", error.response?.data || error.message);
    throw new Error(`Error al obtener pagos: ${error.response?.data?.error || error.message}`);
  }
};

export const addPago = async (pago: Omit<Pago, "id">): Promise<Pago> => {
  try {
    const postResponse = await apiClient.post<SinglePagoApiResponse>("/add/pagosoi", {
      ...pago,
      id_obra_impuesto: pago.id_obra,
      beneficiario: pago.beneficiario.map((b) => ({ id: b.id, nombre: b.nombre })),
      responsables: pago.responsables.map((r) => ({ id: r.id, nombre: r.nombre })),
    });

    const responseData = postResponse.data;
    const pagoId = Number(responseData.id || responseData.id_obra);
    const hasValidId = pagoId && !isNaN(pagoId) && pagoId > 0;

    if (!hasValidId) {
      console.warn("[addPago] La API no devolvió un ID válido, usando ID provisional:", responseData);
      return {
        ...pago,
        id: 0,
        documentos: [],
        tipo_gasto: {
          id: pago.id_tipo_gasto,
          name: pago.tipo_gasto?.name || "Administrativo",
        },
      };
    }

    const fetchedPagos = await fetchPagos(pago.id_obra);
    const newPago = fetchedPagos.find((p) => p.id === pagoId);

    if (!newPago) {
      console.warn("[addPago] No se encontró el pago recién creado, retornando pago con datos enviados:", { pagoId });
      return {
        ...pago,
        id: pagoId,
        documentos: [],
        tipo_gasto: {
          id: pago.id_tipo_gasto,
          name: pago.tipo_gasto?.name || "Administrativo",
        },
      };
    }

    return newPago;
  } catch (error: any) {
    console.error("[addPago] Error al agregar pago:", error.response?.data || error.message);
    throw new Error(`Error al agregar pago: ${error.response?.data?.message || error.message}`);
  }
};

export const updatePago = async (pago: Pago): Promise<Pago> => {
  try {
    const response = await apiClient.post<SinglePagoApiResponse>("/edit/pagosoi", {
      ...pago,
      id_obra_impuesto: pago.id_obra,
      responsables: pago.responsables.map((r) => ({ id: r.id, nombre: r.nombre })),
    });

    const successMessages = [
      "Tipo updated Succeccfully",
      "Pago updated successfully",
      "Updated successfully",
    ];
    const isSuccessMessage = response.data.message && successMessages.includes(response.data.message);

    if (response.data.success || isSuccessMessage) {
      let pagoFromApi = response.data.data;

      if (Array.isArray(pagoFromApi)) {
        pagoFromApi = pagoFromApi.length > 0 ? pagoFromApi[0] : null;
      }

      if (
        pagoFromApi === true ||
        pagoFromApi === null ||
        !pagoFromApi ||
        typeof pagoFromApi !== "object" ||
        !pagoFromApi.id ||
        isNaN(Number(pagoFromApi.id)) ||
        Number(pagoFromApi.id) <= 0
      ) {
        const fetchedPagos = await fetchPagos(pago.id_obra);
        const updatedPago = fetchedPagos.find((p) => p.id === pago.id);
        if (updatedPago) {
          return updatedPago;
        }
        console.warn("[updatePago] No se encontró el pago actualizado, retornando pago original.");
        return pago;
      }

      const beneficiario = parseBeneficiarios(pagoFromApi.beneficiario) || pago.beneficiario;
      const responsables = parseResponsables(pagoFromApi.responsables) || pago.responsables;

      const montoPagado = typeof pagoFromApi.monto_pagado === "string"
        ? parseFloat(pagoFromApi.monto_pagado)
        : typeof pagoFromApi.monto_pagado === "number"
        ? pagoFromApi.monto_pagado
        : pago.monto_pagado;

      return {
        id: Number(pagoFromApi.id),
        concepto: pagoFromApi.concepto || pago.concepto,
        beneficiario,
        fecha: pagoFromApi.fecha || pago.fecha,
        monto_pagado: isNaN(montoPagado) ? pago.monto_pagado : montoPagado,
        id_tipo_gasto: Number(pagoFromApi.id_tipo_gasto) || (pagoFromApi.tipo_gasto?.id ? Number(pagoFromApi.tipo_gasto.id) : pago.id_tipo_gasto),
        id_estado_rembolso: Number(pagoFromApi.id_estado_rembolso) || pago.id_estado_rembolso,
        id_obra: Number(pagoFromApi.id_obra) || pago.id_obra,
        responsables,
        documentos: Array.isArray(pagoFromApi.documentos) ? pagoFromApi.documentos : pago.documentos,
        tipo_gasto: pagoFromApi.tipo_gasto
          ? {
              id: Number(pagoFromApi.tipo_gasto.id) || pago.id_tipo_gasto,
              name: pagoFromApi.tipo_gasto.name || "Desconocido",
            }
          : undefined,
      };
    }

    const message = response.data.message || "El servidor no permitió actualizar el pago.";
    console.error("[updatePago] Falló la actualización:", { responseData: response.data, message });
    throw new Error(message);
  } catch (error: any) {
    console.error("[updatePago] Error al actualizar pago:", {
      responseData: error.response?.data,
      message: error.message,
    });
    throw new Error(`Error al actualizar pago: ${error.response?.data?.message || error.message}`);
  }
};

export const updatePagoEstado = async (id: number, id_estado_rembolso: number, idObraImpuesto?: number): Promise<void> => {
  if (!idObraImpuesto) {
    console.error("[updatePagoEstado] El parámetro id_obra_impuesto es requerido.");
    throw new Error("El ID de la obra es requerido.");
  }
  try {
    await apiClient.post("/edit/pagosoiestado", {
      id,
      id_estado_rembolso,
      id_obra_impuesto: idObraImpuesto,
    });
  } catch (error: any) {
    console.error("[updatePagoEstado] Error al actualizar estado del pago:", error.response?.data || error.message);
    throw new Error(`No se pudo actualizar el estado del pago: ${error.response?.data?.message || error.message}`);
  }
};

export const deletePago = async (id: number | undefined, idObraImpuesto?: number): Promise<void> => {
  if (!id) {
    console.error("[deletePago] El parámetro id es requerido.");
    throw new Error("ID del pago es requerido para eliminar.");
  }
  if (!idObraImpuesto) {
    console.error("[deletePago] El parámetro id_obra_impuesto es requerido.");
    throw new Error("El ID de la obra es requerido.");
  }
  try {
    await apiClient.post("/delete/pagosoi", {
      id,
      id_obra: idObraImpuesto,
    });
    localStorage.removeItem(`grupo_interes_${id}`);
  } catch (error: any) {
    console.error("[deletePago] Error al eliminar pago:", error.response?.data || error.message);
    throw new Error(`No se pudo eliminar el pago: ${error.response?.data?.message || error.message}`);
  }
};

export const deletePagoDocumento = async (
  documentoId: number,
  codigoRegistro: number,
  idObraImpuesto: number,
): Promise<void> => {
  try {
    const response = await apiClient.delete(`/archivosdelete/${documentoId}`, {
      params: {
        codigo_registro: codigoRegistro,
        id_obra: idObraImpuesto,
      },
    });
    if (response.status !== 200) {
      throw new Error("No se pudo eliminar el documento");
    }
  } catch (error: any) {
    console.error("[deletePagoDocumento] Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar el documento");
  }
};
