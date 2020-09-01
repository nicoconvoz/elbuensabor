import { Pipe, PipeTransform } from '@angular/core';
import { Plato } from '../models/Plato';

@Pipe({
  name: 'filterBuscarReceta',
})
export class FilterBuscarRecetaPipe implements PipeTransform {
  transform(value: Plato[], args: string): Plato[] {
    const result = [];
    if (args.length === 0) {
      return value;
    }
    for (const iterator of value) {
      if (iterator.nombre.toLowerCase().indexOf(args.toLowerCase()) > -1) {
        result.push(iterator);
      }
    }
    return result;
  }
}
