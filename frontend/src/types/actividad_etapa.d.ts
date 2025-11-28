export interface ActividadEtapa {
  id_etapa: number;
  id_obra: number;
  nombre_etapa: string;
  fecha_registro: string;
  id_estado_etapa: number;
  orden: number;
  tiene_documento?: boolean;
  comentarios?: string;
}