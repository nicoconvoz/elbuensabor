import { Categoria } from './Categoria';
import { Detalle } from './Detalle';

export interface Plato {
    id ?: number ;
	 tiempoPreparacion ?: number;
	 cantidadVendida ?: number;
	 precioVenta ?: number;
	 precioCosto ?: number;
	 nombre ?: string;
	 descripcion ?: string;
	 imagen ?: string;
	 categoria ?: Categoria;
	 detalle ?: Detalle;
	 eliminado ?: boolean;
}