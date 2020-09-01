import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/allServices/pedido.service';
import { DetalleService } from 'src/app/services/allServices/detalle.service';
import { FacturaService } from 'src/app/services/allServices/factura.service';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { InsumoService } from 'src/app/services/allServices/insumo.service';
import { PlatoService } from 'src/app/services/allServices/plato.service';
import { Pedido } from 'src/app/models/Pedido';

@Component({
  selector: 'app-confirmar-pedido',
  templateUrl: './confirmar-pedido.component.html',
  styleUrls: ['./confirmar-pedido.component.css']
})
export class ConfirmarPedidoComponent implements OnInit {

  pageActual: number = 1;
  indice: number;

  facturas = [];
  d:any;
  facturasConfirmar = [];
  pedido:Pedido;
  detalles = [];
  constructor(
    private pedidoService: PedidoService,
    private detalleService: DetalleService,
    private facturaService: FacturaService,
    private usuarioService: UsuarioService,
    private insumoService: InsumoService,
    private platoService: PlatoService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.cargarFacturas();
    }, 60000);
  }

  cargarFacturas(): void {
    this.facturaService.getAll().subscribe((facturas) => {
      this.facturas=facturas;
      facturas.forEach((fact) => {
        if (this.facturas.length === 0) {
          this.cargarUnPedido(fact.id, false, 0);
        } else {
          let bol = false;
          let idx: number;
          let bool: boolean=false;
          for (let indx = 0; indx < this.facturas.length; indx++) {
            if (this.facturas[indx].id === fact.id) {
              bol = true;
              idx = indx;
              bool = true;
              break;
            }
          }
          for (let indx = 0; indx < this.facturasConfirmar.length; indx++) {
            if (this.facturasConfirmar[indx].id === fact.id) {
              bol = true;
              idx = indx;
              bool = false; 
              break;
            }
          }
          if (bol && this.facturas.length > 0 && bool) {
            this.cargarUnPedido(fact.id, true, idx);
          }
          if (bol && this.facturasConfirmar.length > 0 && !bool) {
            this.cargarUnPedido(fact.id, true, idx);
          }
          if (!bol) {
            this.cargarUnPedido(fact.id, false, 0);
          }
        }
      });
    });
  }
  cargarUnPedido(id: number, bool: boolean, idx: number): void {
    this.facturaService.getOne(id).subscribe((ped) => {
      this.pedidoService.getOne(ped.pedido.id).subscribe((cop) => {
        this.pedido=cop;
        if (cop.estado.nombre !== 'Cancelado') {
          if (cop.estado.nombre !== 'En Aprobacion') {
            ped.pedido = cop;
            this.usuarioService.getOne(ped.usuario.id).subscribe((us) => {
              ped.usuario = us;
            });
            if (bool) {
              this.facturas.splice(idx, 1, ped);
            } else {
              let bandera:boolean=false;
              this.facturas.forEach(element => {
                if(element.id===ped.id){
                  bandera=true;
                }
                if(!bandera){
                  this.facturas.push(ped);
                }
              });
              
            }
          } else {
            ped.pedido = cop;
            this.usuarioService.getOne(ped.usuario.id).subscribe((us) => {
              ped.usuario = us;
            });
            if (bool) {
              this.facturasConfirmar.splice(idx, 1, ped);
            } else {
              let bandera:boolean=false;
              this.facturas.forEach(element => {
                if(element.id===ped.id){
                  bandera=true;
                }
                if(!bandera){
                  this.facturas.push(ped);
                }
              });
            }
          }
        }
      });
    });
  }
  modalDatos(id: number): void {
    this.detalleService.buscarPorPedido(id).subscribe((detalles) => {
      this.d=detalles;
      detalles.forEach((det) => {
        if(det.insumo!=null && det.plato==null){
        this.insumoService.getOne(det.insumo.id).subscribe((ins) => {
          if (ins.nombre !== null) {
            this.detalles.push(ins);
          }
        });
      }
      if(det.plato!=null && det.plato==null){
        this.platoService.getOne(det.plato.id).subscribe((pla) => {
          if (pla.nombre !== null) {
            this.detalles.push(pla);
          }
        });
      }
      });
    });
  }
  limpiarDatos(): void {
    this.detalles = [];
  }
  cancelarPedido(idx: number): void {
    this.facturasConfirmar[idx].pedido.estado.id = 3;
    this.facturasConfirmar[idx].pedido.estado.nombre = 'Cancelado';
    this.pedidoService
      .updateEstado(3, this.facturasConfirmar[idx].pedido)
      .subscribe();
    this.facturasConfirmar.splice(idx, 1);
  }
  aceptarPedido(idx: number): void {
    this.facturasConfirmar[idx].pedido.estado.id = 2;
    this.facturasConfirmar[idx].pedido.estado.nombre = 'En Preparacion';
    this.pedidoService
      .updateEstado(2, this.facturasConfirmar[idx].pedido)
      .subscribe();
    this.facturas.push(this.facturasConfirmar[idx]);
    this.facturasConfirmar.splice(idx, 1);
  }

}
