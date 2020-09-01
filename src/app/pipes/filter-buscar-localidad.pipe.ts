import { Pipe, PipeTransform } from '@angular/core';
import { Pedido } from '../models/Pedido';

@Pipe({
  name: 'filterBuscarLocalidad',
})
export class FilterBuscarLocalidadPipe implements PipeTransform {
  transform(value: Pedido[], ...args: any[]): Pedido[] {
    let result = [];
    if (args.toString() === '') {
      result = value;
    } else {
      for (const iterator of value) {
        if (iterator.domicilio.localidad.nombre === args.toString()) {
          result.push(iterator);
        }
      }
    }
    return result;
  }
}
