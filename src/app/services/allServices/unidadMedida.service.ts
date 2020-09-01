import { UnidadMedida } from './../../models/UnidadMedida';
import { BaseService } from '../base.service';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UnidadMedidaService extends BaseService<UnidadMedida> {
  protected miUrl = 'http://localhost:9000/api/v1/unidad/medida/';
}
