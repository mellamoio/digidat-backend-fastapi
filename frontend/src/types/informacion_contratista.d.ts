/**
 * Datos principales de información contratista desde el backend
 */
export interface ContratistaData {
    id: number;
    id_tipo_contratista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: Array<{ id: number; nombre: string }>;
    responsables: Array<{ id: number; nombre: string }>;
    id_obra: number;
}

/**
 * Datos para crear información contratista (sin id)
 */
export interface ContratistaDataCreate {
    id_tipo_contratista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: Array<{ id: number; nombre: string }>;
    responsables: Array<{ id: number; nombre: string }>;
    id_obra: number;
}

/**
 * Respuesta de la API para información contratista
 */
export interface ContratistaApiResponse {
    length: number;
    map(arg0: (item: ContratistaData) => Promise<{ id: number; tipo: string; id_tipo_contratista: number; aspecto: string; comentarios: string; documentos: contratistaFileObject[]; responsables: { id: string; nombre: any; }[]; categorias: { id: string; nombre: any; }[]; id_obra: number; } | null>): any;
    success: boolean;
    message: string;
    data: ContratistaData[];
}

/**
 * Respuesta de la API para una única entidad
 */
export interface ContratistaSingleResponse {
    success: boolean;
    message: string;
    data: ContratistaData;
}

/**
 * Tipo extendido que cumple con EntityData (compatible con el modal)
 */
export interface ContratistaEntityData {
    id?: number;
    id_tipo_contratista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: Array<{ id: number; nombre: string }>;
    responsables: Array<{ id: number; nombre: string }>;
    id_empresa: number;
    id_obra: number;
    [key: string]: any;
}
