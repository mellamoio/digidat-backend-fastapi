
export interface Pago {
  id: number;
  concepto: string;
  id_tipo_gasto: number;
  id_estado_rembolso: number;
  monto_pagado: number;
  fecha: string;
  beneficiario: { id: number; nombre: string }[];
  grupo_interes: { id: number; nombre: string }[];
  responsables: { id: number; nombre: string }[];
  id_empresa: number;
  id_obra: number;
  documentos: FileObject[];
  tipo_gasto?: { id: number; name: string };
}

export interface NewPago {
  concepto: string;
  beneficiario: { id: number; nombre: string }[];
  grupo_interes: { id: number; nombre: string }[];
  fecha: string;
  monto_pagado: string;
  id_tipo_gasto: number;
  id_estado_rembolso: number;
  id_obra?: number;
  id_responsable?: number;
}

export interface TipoGasto {
  id: number;
  name: string;
}

export interface EstadoReembolso {
  id: number;
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
  id: number;
  nombres: string;
}

interface FiltroValues {
  year: string;
  fechaInicio: string;
  fechaFin: string;
  concepto: string;
  beneficiario: string[];
}

export interface Obra {
  id: number;
  costo_proyecto: number;
}
