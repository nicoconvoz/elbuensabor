import { Pedido } from './Pedido';
import { Insumo } from './Insumo';
import { Plato } from './Plato';

export interface Detalle {
  id?: number;
  cantidad?: number;
  fecha?: Date;
  plato?: Plato;
  insumo?: Insumo;
  pedido?: Pedido;
  eliminado?: boolean;
}
