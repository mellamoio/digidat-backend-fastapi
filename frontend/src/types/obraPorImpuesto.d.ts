export interface Responsable {
    id: number;
    nombre: string;
  }

  export interface ObraPorImpuesto {
    id?: number;
    nombre: string;
    tipo_id: number;
    estado_id: number;
    costo_proyecto: number;
    fecha_reembolso: string;
    fecha_conclusion: string;
    responsable: Responsable[];
    unidades_gestion: UnidadGestion[];
    centros_operacion: CentroOperacion[];
    id_empresa: number;
    
  }