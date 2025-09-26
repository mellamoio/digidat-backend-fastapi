export interface User {
  id_responsable: number;
  nombre: string;
  correo: string;
  contrasena_hash?: string;
  estado: boolean;
  id_role: number;
  cargo?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface UserCreate {
  nombre: string;
  correo: string;
  contrasena: string;
  estado: boolean;
  id_rol: number;
  cargo?: string;
}

export interface UserUpdate {
  nombre?: string;
  correo?: string;
  estado?: boolean;
  id_rol?: number;
  cargo?: string;
}
