import { CategoriaInsumo } from '../../models/CategoriaInsumo';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsumoCategoriaService extends BaseService<CategoriaInsumo> {
  protected miUrl = 'http://localhost:9000/api/v1/insumo/categoria/';
  protected miUrl2 = 'http://localhost:9000/api/v1/insumo/categoria/NoInsumo/';

  constructor(protected http: HttpClient) {
    super(http);
  }

  buscarporCategoria(): Observable<CategoriaInsumo[]> {
    return this.http.get<CategoriaInsumo[]>(this.miUrl2);
  }
}
