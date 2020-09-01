import { BaseService } from '../base.service';
import { Detalle } from '../../models/Detalle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DetalleService extends BaseService<Detalle> {
  protected miUrl = 'http://localhost:9000/api/v1/detalle/';
  protected miUrl2 = 'http://localhost:9000/api/v1/detalle/query/';
  protected miUrl3 = 'http://localhost:9000/api/v1/detalle/buscarPorPlato/';
  protected miUrl4 = 'http://localhost:9000/api/v1/detalle/buscarPorInsumo/';
  protected miUrl5 = 'http://localhost:9000/api/v1/detalle/subirPlato/';
  protected miUrl6 = 'http://localhost:9000/api/v1/detalle/descontarPlatos/';

  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarPorPedido(id: number): Observable<Detalle[]> {
    return this.http.get<Detalle[]>(this.miUrl2 + id);
  }
  buscarPorPlato(id: number, id2: number): Observable<Detalle[]> {
    return this.http.get<Detalle[]>(this.miUrl3 + id + '/' + id2);
  }
  buscarPorInsumo(id: number, id2: number): Observable<Detalle[]> {
    return this.http.get<Detalle[]>(this.miUrl3 + id + '/' + id2);
  }
  subirPlato(id: number, detalle: Detalle): Observable<Detalle> {
    return this.http.put<Detalle>(this.miUrl5 + id, detalle);
  }
  descontarPlatos(id: number): Observable<Detalle> {
    return this.http.put<Detalle>(this.miUrl6 + id, null);
  }
}
