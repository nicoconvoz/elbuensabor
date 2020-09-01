import { BaseService } from '../base.service';
import { Insumo } from '../../models/Insumo';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class InsumoService extends BaseService<Insumo> {
  protected miUrl = 'http://localhost:9000/api/v1/insumo/';
  protected miUrl3 = 'http://localhost:9000/api/v1/insumo/esInsumo/' + true;
  protected miUrl2 = 'http://localhost:9000/api/v1/insumo/insumoporcategoria/';
  protected miUrl4 = 'http://localhost:9000/api/v1/insumo/stocks/';
  
  protected miUrl5 =
    'http://localhost:9000/api/v1/insumo/buscarPorCategoriaNoInsumo/';
    protected miUrl6 = 'http://localhost:9000/api/v1/insumo/stocksSinCategoria/';

  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarporCategoria(id: number): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.miUrl2 + id);
  }

  buscarInsumoporCategoria(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.miUrl3);
  }

  getStocks(id: number): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.miUrl4 + id);
  }

  getStocksSinCategoria(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.miUrl6);
  }

  buscarPorCategoriaNoInsumo(id: number): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.miUrl5 + id);
  }

  getEsInsumo(esInsumo: boolean): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.miUrl + '/esInsumo/' + esInsumo);
  }
}
