import { UnidadMedida } from './UnidadMedida';
export interface Insumo {
  id: number;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  esInsumo: boolean;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: {
    id: number;
  };
  unidadMedida: UnidadMedida;
  eliminado: boolean;
}
