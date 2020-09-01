import { BaseService } from '../base.service';
import { Plato } from '../../models/Plato';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RankingPlatosService {
  protected miUrl = 'http://localhost:9000/api/v1/factura/platosPopulares/';

  constructor(protected http: HttpClient) {}

  platosPopulares(fechaDesde: String, fechaHasta: String): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.miUrl + fechaDesde + '/' + fechaHasta);
  }
}
