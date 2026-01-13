import apiClient from '../api/api'
import { DigidatRoutes } from '../routes'
import type { Pago, NewPago, TipoGastoResponse } from "../types/pagos";

interface PagoApiResponse {
  id_pago: number;
  concepto: string;
  id_obra: number;
  monto_pagado: string | number;
  fecha_pago: string;
  id_tipo_gasto: number;
  es_reembolsable: boolean;
  id_estado_reembolso: number;
  id_responsable: number | null;
  id_beneficiario: number | null;
  tipo_gasto: TipoGastoResponse;
}

// ✅ Usando DigidatRoutes
export const fetchPagos = async (idObra: number): Promise<Pago[]> => {
  if (!idObra) {
    console.error("[fetchPagos] El parámetro id_obra es requerido.");
    throw new Error("El ID de la obra es requerido.");
  }

  try {
    const response = await apiClient.get<PagoApiResponse[]>(DigidatRoutes.GET_PAGOS, {
      params: {
        id_obra: idObra,
      },
    });

    const pagos = response.data || [];

    return pagos.map((pago: PagoApiResponse) => ({
      id_pago: pago.id_pago,
      concepto: pago.concepto || "",
      id_beneficiario: pago.id_beneficiario,
      fecha_pago: pago.fecha_pago || "",
      monto_pagado: typeof pago.monto_pagado === "string" 
        ? parseFloat(pago.monto_pagado) 
        : pago.monto_pagado,
      id_tipo_gasto: pago.id_tipo_gasto,
      es_reembolsable: pago.es_reembolsable || false,
      id_estado_reembolso: pago.id_estado_reembolso,
      id_obra: pago.id_obra,
      id_responsable: pago.id_responsable,
      documentos: [],
      tipo_gasto: pago.tipo_gasto,
    }));
  } catch (error: any) {
    console.error("[fetchPagos] Error al obtener pagos:", error.response?.data || error.message);
    throw new Error(`Error al obtener pagos: ${error.response?.data?.detail || error.message}`);
  }
};

export const addPago = async (pago: NewPago): Promise<Pago> => {
  try {
    
    const payload = {
      id_obra: pago.id_obra,
      concepto: pago.concepto,
      monto_pagado: typeof pago.monto_pagado === "string" 
        ? parseFloat(pago.monto_pagado) 
        : pago.monto_pagado,
      fecha_pago: pago.fecha_pago,
      id_tipo_gasto: pago.id_tipo_gasto,
      es_reembolsable: pago.es_reembolsable,
      id_estado_reembolso: pago.id_estado_reembolso,
      id_responsable: pago.id_responsable,
      id_beneficiario: pago.id_beneficiario,
    };

    const response = await apiClient.post<PagoApiResponse>(DigidatRoutes.CREATE_PAGO, payload);
    const pagoCreado = response.data;

    return {
      id_pago: pagoCreado.id_pago,
      concepto: pago.concepto,
      id_beneficiario: pagoCreado.id_beneficiario,
      fecha_pago: pagoCreado.fecha_pago,
      monto_pagado: typeof pagoCreado.monto_pagado === "string"
        ? parseFloat(pagoCreado.monto_pagado)
        : pagoCreado.monto_pagado,
      id_tipo_gasto: pagoCreado.id_tipo_gasto,
      es_reembolsable: pagoCreado.es_reembolsable,
      id_estado_reembolso: pagoCreado.id_estado_reembolso,
      id_obra: pagoCreado.id_obra,
      id_responsable: pagoCreado.id_responsable,
      documentos: [],
      tipo_gasto: pagoCreado.tipo_gasto,
    };
  } catch (error: any) {
    console.error("❌ [addPago] Error completo:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    throw new Error(`Error al agregar pago: ${error.response?.data?.detail || error.message}`);
  }
};


export const updatePago = async (pago: Pago): Promise<Pago> => {
  try {
    // ✅ Reemplazar :id con el id real
    const url = DigidatRoutes.UPDATE_PAGO.replace(':id', pago.id_pago.toString());
    
    const response = await apiClient.put<PagoApiResponse>(url, {
      id_obra: pago.id_obra,
      concepto: pago.concepto,
      monto_pagado: pago.monto_pagado,
      fecha_pago: pago.fecha_pago,
      id_tipo_gasto: pago.id_tipo_gasto,
      es_reembolsable: pago.es_reembolsable,
      id_estado_reembolso: pago.id_estado_reembolso,
      id_responsable: pago.id_responsable,
      id_beneficiario: pago.id_beneficiario,
    });

    const pagoActualizado = response.data;

    return {
      id_pago: pagoActualizado.id_pago,
      concepto: pago.concepto,
      id_beneficiario: pagoActualizado.id_beneficiario,
      fecha_pago: pagoActualizado.fecha_pago,
      monto_pagado: typeof pagoActualizado.monto_pagado === "string"
        ? parseFloat(pagoActualizado.monto_pagado)
        : pagoActualizado.monto_pagado,
      id_tipo_gasto: pagoActualizado.id_tipo_gasto,
      es_reembolsable: pagoActualizado.es_reembolsable,
      id_estado_reembolso: pagoActualizado.id_estado_reembolso,
      id_obra: pagoActualizado.id_obra,
      id_responsable: pagoActualizado.id_responsable,
      documentos: pago.documentos,
      tipo_gasto: pagoActualizado.tipo_gasto,
    };
  } catch (error: any) {
    console.error("[updatePago] Error al actualizar pago:", error.response?.data || error.message);
    throw new Error(`Error al actualizar pago: ${error.response?.data?.detail || error.message}`);
  }
};

export const deletePago = async (idPago: number): Promise<void> => {
  if (!idPago) {
    console.error("[deletePago] El parámetro id_pago es requerido.");
    throw new Error("ID del pago es requerido para eliminar.");
  }

  try {
    // ✅ Reemplazar :id con el id real
    const url = DigidatRoutes.DELETE_PAGO.replace(':id', idPago.toString());
    await apiClient.delete(url);
  } catch (error: any) {
    console.error("[deletePago] Error al eliminar pago:", error.response?.data || error.message);
    throw new Error(`No se pudo eliminar el pago: ${error.response?.data?.detail || error.message}`);
  }
};

export const fetchTiposGasto = async (): Promise<TipoGastoResponse[]> => {
  try {
    const response = await apiClient.get<TipoGastoResponse[]>(DigidatRoutes.GET_TIPOS_GASTO);
    return response.data;
  } catch (error: any) {
    console.error("[fetchTiposGasto] Error:", error.response?.data || error.message);
    throw new Error(`Error al obtener tipos de gasto: ${error.response?.data?.detail || error.message}`);
  }
};
