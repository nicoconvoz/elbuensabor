import { ConfiguracionEmpresa } from './../../models/ConfiguracionEmpresa';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  constructor(protected http: HttpClient) {}

  protected miUrl = 'http://localhost:9000/api/v1/configuracionEmpresa';

  getOne(id: number): Observable<ConfiguracionEmpresa> {
    return this.http.get<ConfiguracionEmpresa>(this.miUrl + '/' + id);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.miUrl + '/' + id);
  }

  post(entity: ConfiguracionEmpresa): Observable<ConfiguracionEmpresa> {
    return this.http.post<ConfiguracionEmpresa>(this.miUrl + '/', entity);
  }

  put(id: number, entity: ConfiguracionEmpresa) {
    return this.http.put<ConfiguracionEmpresa>(this.miUrl + '/' + id, entity);
  }
}
