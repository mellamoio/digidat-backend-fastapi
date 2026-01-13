export enum DigidatRoutes {
  // Users
  GET_USERS = '/v1/users/',
  GET_USER_BY_ID = '/v1/users/:id',
  CREATE_USER = '/v1/users/',
  UPDATE_USER = '/v1/users/:id',
  DELETE_USER = '/v1/users/:id',
  
  // Obras
  GET_OBRAS = '/v1/obras/',
  GET_OBRA_BY_ID = '/v1/obras/:id',
  CREATE_OBRA = '/v1/obras/',
  UPDATE_OBRA = '/v1/obras/:id',
  DELETE_OBRA = '/v1/obras/:id',
  
  // Centros de Operación
  GET_CENTROS_OPERACION = '/v1/centros-operacion/',
  
  // Estados de Etapa
  GET_ESTADOS_ETAPA = '/v1/estados-etapa/',
  
  // Auth
  LOGIN = '/v1/auth/login',
  LOGOUT = '/v1/auth/logout',
  REFRESH_TOKEN = '/v1/auth/refresh-token',
  
  // Tipos de Gasto
  GET_TIPOS_GASTO = '/v1/tipos-gasto/',
  
  // Pagos
  GET_PAGOS = '/v1/pagos/',
  GET_PAGO_BY_ID = '/v1/pagos/:id',
  CREATE_PAGO = '/v1/pagos/',
  UPDATE_PAGO = '/v1/pagos/:id',
  DELETE_PAGO = '/v1/pagos/:id',
  
  // Corregir cuando estén migrados
  GET_CATEGORIAS_DOCUMENTOS = '/all/categorias-documentos',
}
