import { Usuario } from 'src/app/models/Usuario';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) {}

  _miUrl: string = 'http://localhost:9000/api/v1/usuario/';

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this._miUrl);
  }

  getOne(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this._miUrl + id);
  }

  getEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(this._miUrl + 'searchbyemail/' + email);
  }

  post(usuarioNuevo: Usuario): Observable<Usuario> {
    return this.http.post(this._miUrl, usuarioNuevo);
  }

  put(id: number, usuarioNuevo: Usuario): Observable<Usuario> {
    return this.http.put(this._miUrl + id, usuarioNuevo);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this._miUrl + id);
  }
}
