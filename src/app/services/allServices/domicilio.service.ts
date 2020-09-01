import { BaseService } from '../base.service';
import { Domicilio } from '../../models/Domicilio';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DomicilioService extends BaseService<Domicilio> {
  protected miUrl = 'http://localhost:9000/api/v1/domicilio/';
  protected miUrl2 = 'http://localhost:9000/api/v1/domicilio/buscarporUsuario/';

  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarporUsuario(id: number): Observable<Domicilio[]> {
    return this.http.get<Domicilio[]>(this.miUrl2 + id);
  }
}
