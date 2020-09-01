export interface Usuario {
  id?: number;
  dni?: number;
  telefono?: number;
  esCliente?: boolean;
  fechaNacimiento?: Date; //volver a cambiar
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  imagen?: string;
  rol?: string;
  eliminado?: boolean;
}
