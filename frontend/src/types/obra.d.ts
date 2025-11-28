export interface Responsable {
  some(arg0: (user: any) => boolean): unknown;
  id_responsable: number;
  nombre: string;
}

export interface CentroOperacion {
  id: number;
  nombre: string;
}

export interface Obra {
  id_obra: number;
  nombre: string;
  tipo_id: number;
  estado_id: number;
  costo_proyecto: number;
  fecha_inicio: string;
  fecha_fin: string;
  id_responsable?: number;
  id_empresa?: number;
  centros_operacion: CentroOperacion[];
  responsable?: Responsable;
  monto_recuperado?: number;
  monto_pagado?: number;
}