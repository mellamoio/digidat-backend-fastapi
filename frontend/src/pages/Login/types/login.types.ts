export interface LoginFormValues {
  correo: string;
  password: string;
}

export interface LoginResponse {
  response_code?: number;
  message?: string;
  data?: {
    access_token: string;
  };
}
