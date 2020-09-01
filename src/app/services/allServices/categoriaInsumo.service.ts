import { BaseService } from '../base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaInsumo } from 'src/app/models/CategoriaInsumo';
@Injectable({
  providedIn: 'root',
})
export class CategoriaInsumoService extends BaseService<CategoriaInsumo> {
  protected miUrl = 'http://localhost:9000/api/v1/insumo/categoria/';
  protected miUrl2 = 'http://localhost:9000/api/v1/insumo/categoria/NoInsumo/';

  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarporCategoria(): Observable<CategoriaInsumo[]> {
    return this.http.get<CategoriaInsumo[]>(this.miUrl2);
  }
}
