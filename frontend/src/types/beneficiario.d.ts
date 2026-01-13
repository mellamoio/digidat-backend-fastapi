/**
 * Tipos de datos para Beneficiario
 * Corresponde al modelo SQLAlchemy y schemas de Pydantic
 */

/**
 * Interface base para Beneficiario
 */
export interface BeneficiarioBase {
  nombre: string;
  documento: string | null;
}

/**
 * Interface para crear un nuevo Beneficiario
 */
export interface BeneficiarioCreate extends BeneficiarioBase {
  // Hereda nombre y documento de BeneficiarioBase
}

/**
 * Interface para actualizar un Beneficiario existente
 * Todos los campos son opcionales
 */
export interface BeneficiarioUpdate {
  nombre?: string;
  documento?: string | null;
}

/**
 * Interface completa de Beneficiario con ID
 * Representa el modelo completo retornado por la API
 */
export interface Beneficiario extends BeneficiarioBase {
  id_beneficiario: number;
}

/**
 * Parámetros de consulta para listado paginado
 */
export interface BeneficiarioQueryParams {
  skip?: number;
  limit?: number;
}

/**
 * Respuesta de la API para operaciones con beneficiarios
 */
export interface BeneficiarioApiResponse {
  success?: boolean;
  data?: Beneficiario | Beneficiario[];
  message?: string;
}
