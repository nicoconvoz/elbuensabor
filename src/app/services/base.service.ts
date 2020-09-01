import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService<E> {
  constructor(protected http: HttpClient) {}

  protected miUrl: string;

  getAll(): Observable<E[]> {
    return this.http.get<E[]>(this.miUrl);
  }

  getOne(id: number): Observable<E> {
    return this.http.get<E>(this.miUrl + '/' + id);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.miUrl + '/' + id);
  }

  post(entity: E): Observable<E> {
    return this.http.post<E>(this.miUrl + '/', entity);
  }

  put(id: number, entity: E) {
    return this.http.put<E>(this.miUrl + '/' + id, entity);
  }
}
