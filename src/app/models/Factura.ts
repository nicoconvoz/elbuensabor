import { Detalle } from './Detalle';
import { Pedido } from './Pedido';
import { Usuario } from './Usuario';

export interface Factura {
  id?: number;
  subtotal?: number;
  montoDescuento?: number;
  total?: number;
  fecha?: Date;
  tipoFactura?: string;
  dniTitular?: number;
  tipoPago?: string;
  usuario?: Usuario;
  pedido?: Pedido;
  nroTarjeta?: number;
  detalle?: Detalle[];
  eliminado?: boolean;
}
