import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { Pedido } from '../../models/Pedido';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PedidoService extends BaseService<Pedido> {
  protected miUrl = 'http://localhost:9000/api/v1/pedido/';
  protected miUrl2 = 'http://localhost:9000/api/v1/pedido/estado/';
  protected miUrl3 = 'http://localhost:9000/api/v1/pedido/byUser/';

  updateEstado(status: number, pedido: any): Observable<any> {
    return this.http.put<any>(
      this.miUrl + 'changeStatus/' + pedido.id + '/' + status,
      pedido
    );
  }

  updateTiempoRestante(id: number, tiempoRestante: number): Observable<any> {
    return this.http.put<any>(
      this.miUrl + 'updateTiempoRestante/' + id + '/' + tiempoRestante,
      []
    );
  }

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.miUrl + 'getPedidos');
  }

  getPedidoEstado(id: number, id2: number): Observable<any[]> {
    return this.http.get<any[]>(this.miUrl2 + id + '/' + id2);
  }

  getPedidosMenosFacturados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.miUrl + 'getPedidosMenosFacturados/');
  }

  getAllPedidosXId(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.miUrl3 + id);
  }

  getPedidosPorUsuario(
    id: number,
    fechaDesde: String,
    fechaHasta: String
  ): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(
      this.miUrl +
        '/getPedidosPorUsuario/' +
        id +
        '/' +
        fechaDesde +
        '/' +
        fechaHasta
    );
  }
}
