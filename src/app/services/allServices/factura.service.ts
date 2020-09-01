import { Recaudaciones } from './../../models/Recaudaciones';
import { Factura } from './../../models/Factura';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatosPopulares } from 'src/app/models/PlatosPopulares';

@Injectable({
  providedIn: 'root',
})
export class FacturaService extends BaseService<Factura> {
  protected miUrl = 'http://localhost:9000/api/v1/factura/';
  protected miUrl2 = 'http://localhost:9000/api/v1/factura/platosPopulares/';

  constructor(protected http: HttpClient) {
    super(http);
  }

  platosPopulares(
    fechaDesde: String,
    fechaHasta: String
  ): Observable<PlatosPopulares> {
    return this.http.get<PlatosPopulares>(
      this.miUrl2 + fechaDesde + '/' + fechaHasta + '/'
    );
  }
  recaudaciones(
    fechaDesde: String,
    fechaHasta: String
  ): Observable<Recaudaciones> {
    return this.http.get<Recaudaciones>(
      this.miUrl + 'recaudaciones/' + fechaDesde + '/' + fechaHasta + '/'
    );
  }
  getAllMenosFacturados():Observable<Factura[]>{
    return this.http.get<Factura[]>(this.miUrl + 'getFacturasMenosFacturados/');
  }
  getAllEnLocal():Observable<Factura[]>{
    return this.http.get<Factura[]>(this.miUrl + 'getAllEnLocal/');
  }
}
