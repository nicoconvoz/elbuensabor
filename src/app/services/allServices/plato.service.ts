import { BaseService } from '../base.service';
import { Plato } from '../../models/Plato';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PlatoService extends BaseService<Plato> {
  protected miUrl = 'http://localhost:9000/api/v1/plato/';
  protected miUrl2 = 'http://localhost:9000/api/v1/plato/platoPorCategoria/';

  constructor(protected http: HttpClient) {
    super(http);
  }

  public buscarPlatoPorCategoria(id: number): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.miUrl2 + id);
  }

  getByCategory(categoria: string): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.miUrl + 'searchByCategory/' + categoria);
  }

  consultarStock(plato: number, cantidad: number): Observable<boolean> {
    return this.http.get<boolean>(
      this.miUrl + 'verificarStock/' + plato + '/' + cantidad
    );
  }
}
