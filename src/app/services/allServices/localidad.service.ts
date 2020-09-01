import { BaseService } from '../base.service';
import { Localidad } from '../../models/Localidad';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LocalidadService extends BaseService<Localidad> {
  protected miUrl = 'http://localhost:9000/api/v1/localidad/';

  constructor(protected http: HttpClient) {
    super(http);
  }
}
