import { BaseService } from '../base.service';
import { Estado } from '../../models/Estado';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class EstadoService extends BaseService<Estado> {
  protected miUrl = 'http://localhost:9000/api/v1/estado/';
}
