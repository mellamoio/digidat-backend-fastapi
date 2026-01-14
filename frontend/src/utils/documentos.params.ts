import type { GetDocumentosParams, UploadDocumentoParams } from "../types/documentos.d";

/**
 * Props base para construcción de parámetros
 */
interface BuildParamsProps {
  id_obra?: number | null;
  id_etapa?: number;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
  id_pago?: number;
}

/**
 * Valida que financista y contratista no se usen simultáneamente
 */
const validateMutuallyExclusive = (
  id_informacionfinancista?: number,
  id_informacioncontratista?: number,
  functionName?: string
): void => {
  if (id_informacionfinancista != null && id_informacioncontratista != null) {
    const error = `No se pueden enviar id_informacionfinancista e id_informacioncontratista simultáneamente`;
    console.error(`⚠️ [${functionName}] ERROR:`, {
      id_informacionfinancista,
      id_informacioncontratista,
    });
    throw new Error(error);
  }
};

/**
 * Construye parámetros de subida filtrando valores null/undefined
 */
export const buildUploadParams = (props: BuildParamsProps): UploadDocumentoParams => {
  validateMutuallyExclusive(
    props.id_informacionfinancista,
    props.id_informacioncontratista,
    "buildUploadParams"
  );

  const params: UploadDocumentoParams = {};
  
  if (props.id_obra != null) params.id_obra = props.id_obra;
  if (props.id_etapa != null) params.id_etapa = props.id_etapa;
  
  if (props.id_informacionfinancista != null) {
    params.id_informacionfinancista = props.id_informacionfinancista;
  } else if (props.id_informacioncontratista != null) {
    params.id_informacioncontratista = props.id_informacioncontratista;
  }
  
  if (props.id_pago != null) params.id_pago = props.id_pago;
  
  console.log("[buildUploadParams] Parámetros construidos:", params);
  
  return params;
};

/**
 * Construye parámetros de consulta filtrando valores null/undefined
 */
export const buildGetDocumentosParams = (props: BuildParamsProps): GetDocumentosParams => {
  validateMutuallyExclusive(
    props.id_informacionfinancista,
    props.id_informacioncontratista,
    "buildGetDocumentosParams"
  );

  const params: GetDocumentosParams = {};
  
  if (props.id_obra != null) params.id_obra = props.id_obra;
  if (props.id_etapa != null) params.id_etapa = props.id_etapa;
  
  if (props.id_informacionfinancista != null) {
    params.id_informacionfinancista = props.id_informacionfinancista;
  } else if (props.id_informacioncontratista != null) {
    params.id_informacioncontratista = props.id_informacioncontratista;
  }
  
  if (props.id_pago != null) params.id_pago = props.id_pago;
  
  console.log("[buildGetDocumentosParams] Parámetros construidos:", params);
  
  return params;
};
