import { Plato } from './Plato';
import { Insumo } from './Insumo';
import { UnidadMedida } from './UnidadMedida';

export interface DetallePlato {
  id: number;
  cantidad: number;
  ingrediente: Insumo;
  plato: Plato;
  unidadMedida:UnidadMedida;
  eliminado: boolean;
}
