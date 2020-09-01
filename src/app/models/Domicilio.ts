export interface Domicilio {
  id?: number;
  calle?: string;
  numero?: number;
  departamento?: string;
  piso?: string;
  localidad: {
    id: number;
    nombre?: string;
  };
  propietario: {
    id: number;
  };
  eliminado?: boolean;
}
