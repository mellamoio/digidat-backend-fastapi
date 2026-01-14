export enum DigidatRoutes {
  LOGIN = '/v1/auth/login',
  LOGOUT = '/v1/auth/logout',
  REFRESH_TOKEN = '/v1/auth/refresh-token',
  
  GET_USERS = '/v1/users/',
  GET_USER_BY_ID = '/v1/users/:id',
  CREATE_USER = '/v1/users/',
  UPDATE_USER = '/v1/users/:id',
  DELETE_USER = '/v1/users/:id',
  
  GET_OBRAS = '/v1/obras/',
  GET_OBRA_BY_ID = '/v1/obras/:id',
  CREATE_OBRA = '/v1/obras/',
  UPDATE_OBRA = '/v1/obras/:id',
  DELETE_OBRA = '/v1/obras/:id',
  
  GET_PAGOS = '/v1/pagos/',
  GET_PAGO_BY_ID = '/v1/pagos/:id',
  CREATE_PAGO = '/v1/pagos/',
  UPDATE_PAGO = '/v1/pagos/:id',
  DELETE_PAGO = '/v1/pagos/:id',
  
  GET_DOCUMENTOS = '/v1/documents/',
  UPLOAD_DOCUMENTO = '/v1/documents/upload',
  GET_DOCUMENTO_BY_ID = '/v1/documents/:id',
  GET_DOCUMENTO_URL = '/v1/documents/:id/url',
  DELETE_DOCUMENTO = '/v1/documents/:id',
  
  GET_CATEGORIAS_DOCUMENTOS = '/v1/categorias-documento/',
  
  GET_TIPOS_GASTO = '/v1/tipos-gasto/',
  
  GET_ESTADOS_ETAPA = '/v1/estados-etapa/',
  
  GET_ACTIVIDADES_ETAPA = '/v1/actividad-etapa/',
  GET_ACTIVIDAD_ETAPA_BY_ID = '/v1/actividad-etapa/:id',
  DELETE_ACTIVIDAD_ETAPA = '/v1/actividad-etapa/:id',
  INICIALIZAR_ACTIVIDADES_ETAPA = '/v1/actividad-etapa/inicializar-actividades/:id',
  
  GET_CENTROS_OPERACION = '/v1/centros-operacion/',
  
  GET_INFORMACION_FINANCISTA = '/v1/informacion-financista/',
  GET_INFORMACION_FINANCISTA_BY_ID = '/v1/informacion-financista/:id',
  CREATE_INFORMACION_FINANCISTA = '/v1/informacion-financista/',
  UPDATE_INFORMACION_FINANCISTA = '/v1/informacion-financista/:id',
  DELETE_INFORMACION_FINANCISTA = '/v1/informacion-financista/:id',
  
  GET_INFORMACION_CONTRATISTA = '/v1/informacion-contratista/',
  GET_INFORMACION_CONTRATISTA_BY_ID = '/v1/informacion-contratista/:id',
  CREATE_INFORMACION_CONTRATISTA = '/v1/informacion-contratista/',
  UPDATE_INFORMACION_CONTRATISTA = '/v1/informacion-contratista/:id',
  DELETE_INFORMACION_CONTRATISTA = '/v1/informacion-contratista/:id',
  
  GET_ARCHIVOS_ALL = '/archivos/all',
  DELETE_ARCHIVO = '/archivosdelete/:id',
}

export const replaceRouteParams = (route: string, params: Record<string, string | number>): string => {
  let result = route;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};