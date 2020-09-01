import { Estado } from './Estado';
import { Domicilio } from './Domicilio';
import { Usuario } from './Usuario';

export interface Pedido {
  id?: number;
  envioDelivery?: boolean;
  monto?: number;
  fecha?: Date;
  estado?: Estado;
  usuario?: Usuario;
  domicilio?: Domicilio;
  tiempoPreparacion?: number;
  eliminado?: boolean;
}
