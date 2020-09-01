import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DetalleService } from '../../services/allServices/detalle.service';
import { PlatoService } from '../../services/allServices/plato.service';
import { PedidoService } from '../../services/allServices/pedido.service';
import { Plato } from 'src/app/models/Plato';
import { Detalle } from 'src/app/models/Detalle';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
})
export class ComandaComponent implements OnInit {
  @Input() comanda;
  @Input() delivery;
  @Input() tipoPago;
  @Input() total;
  @Output() eliminarComanda = new EventEmitter();
  @Output() pedidoEntregado = new EventEmitter();
  productos: Plato[] = [];
  cantidad: number[] = [];
  idDetalle = 0;

  constructor(
    private detalleService: DetalleService,
    private platoService: PlatoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarTabla();
  }

  cancelarInterval(interval: any): void {
    clearInterval(interval);
  }
  cargarTabla(): void {
    this.detalleService
      .buscarPorPedido(this.comanda.id)
      .subscribe((detalles) => {
        detalles.forEach((detalle) => {
          this.detalleService.getOne(detalle.id).subscribe((detalleData) => {
            this.platoService
              .getOne(detalleData.plato.id)
              .subscribe((plato) => {
                if (plato.nombre !== 'Plato Vacio') {
                  this.productos.push(plato);
                  this.cantidad.push(detalleData.cantidad);
                }
              });
          });
        });
      });
  }
  pedidoEntregar(id: number): void {
    this.pedidoService.updateEstado(6, this.comanda).subscribe(() => {
      this.onPedidoEntregado(id);
    });
  }
  terminarPedido(id: number): void {
    this.pedidoService.updateEstado(1, this.comanda).subscribe(() => {
          this.detalleService.descontarPlatos(id).subscribe(() => {
            this.onEliminarComanda(id);
          });
    });
  }

  onPedidoEntregado(id: number): void {
    this.pedidoEntregado.emit(id);
  }
  onEliminarComanda(id: number): void {
    this.eliminarComanda.emit(id);
  }
}
