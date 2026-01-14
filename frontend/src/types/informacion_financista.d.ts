/**
 * Datos principales de información financista desde el backend
 */
export interface FinancistaData {
    id: number;
    id_tipo_financista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: Array<{ id: number; nombre: string }>;
    responsables: Array<{ id: number; nombre: string }>;
    id_obra: number;
}

/**
 * Datos para crear información financista (sin id)
 */
export interface FinancistaDataCreate {
    id_tipo_financista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: Array<{ id: number; nombre: string }>;
    responsables: Array<{ id: number; nombre: string }>;
    id_obra: number;
}

/**
 * Respuesta de la API para información financista
 */
export interface FinancistaApiResponse {
    length: number;
    map(arg0: (item: FinancistaData) => Promise<{ id: number; tipo: string; id_tipo_financista: number; aspecto: string; comentarios: string; documentos: FinancistaFileObject[]; responsables: { id: string; nombre: any; }[]; categorias: { id: string; nombre: any; }[]; id_obra: number; } | null>): any;
    success: boolean;
    message: string;
    data: FinancistaData[];
}

/**
 * Respuesta de la API para una única entidad
 */
export interface FinancistaSingleResponse {
    success: boolean;
    message: string;
    data: FinancistaData;
}

/**
 * Tipo extendido que cumple con EntityData (compatible con el modal)
 */
export interface FinancistaEntityData {
    id?: number;
    id_tipo_financista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: Array<{ id: number; nombre: string }>;
    responsables: Array<{ id: number; nombre: string }>;
    id_empresa: number;
    id_obra: number;
    [key: string]: any;
}
