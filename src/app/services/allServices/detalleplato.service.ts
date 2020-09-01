import { BaseService } from '../base.service';
import { DetallePlato } from '../../models/DetallePlato';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class DetallePlatoService extends BaseService<DetallePlato> {
  protected miUrl = 'http://localhost:9000/api/v1/detalle/plato';
}
