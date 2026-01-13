export interface Pago {
  id_pago: number;
  concepto: string;
  id_tipo_gasto: number;
  es_reembolsable: boolean;
  id_estado_reembolso: number;
  monto_pagado: number;
  fecha_pago: string;
  id_beneficiario: number | null;
  id_responsable: number | null;
  id_obra: number;
  documentos: FileObject[];
  tipo_gasto?: TipoGastoResponse;
}
export interface NewPago {
  concepto: string;
  id_beneficiario: number | null;
  fecha_pago: string;
  monto_pagado: number;
  id_tipo_gasto: number;
  es_reembolsable: boolean;
  id_estado_reembolso: number;
  id_obra: number;
  id_responsable: number | null;
}

export interface TipoGasto {
  id: number;
  nombre: string;
}

export interface TipoGastoResponse {
  id: number;
  nombre: string;
}
export interface EstadoReembolso {
  id_estado_reembolso: number;
  nombre: string;
}
export interface FileObject {
  categoria_id?: number | null;
  id?: string;
  file?: File | null;
  url?: string;
  nombre_original?: string;
  esImagen?: boolean;
  esPDF?: boolean;
}

export interface Responsable {
  id_responsable: number;
  nombres: string;
}
export interface Beneficiario {
  id_beneficiario: number;
  nombre: string;
}
interface FiltroValues {
  year: string;
  fechaInicio: string;
  fechaFin: string;
  concepto: string;
  beneficiario: string[];
}

export interface Obra {
  id_obra: number;
  costo_proyecto: number;
}
