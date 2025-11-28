export interface SeccionDesplegableProps {
  titulo: string;
  progreso: number;
  fechaInicio?: string;
  fechaFin?: string;
  children: React.ReactNode;
  initialOpen?: boolean;
}