import { Component, OnInit } from '@angular/core';
import { LocalidadService } from '../../services/allServices/localidad.service';
import { PedidoService } from '../../services/allServices/pedido.service';
import { FacturaService } from '../../services/allServices/factura.service';
import { Pedido } from '../../models/Pedido';
import { Localidad } from '../../models/Localidad';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { RolesService } from 'src/app/services/allServices/roles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
})
export class DeliveryComponent implements OnInit {
  pedidos: Pedido[] = [];
  filterB = '';
  localidades: Localidad[] = [];
  pedidosAceptados: Pedido[] = [];
  tipoPago: string[] = [];
  total: number[] = [];

  public usuario: Usuario;

  constructor(
    private localidadService: LocalidadService,
    private pedidoService: PedidoService,
    private facturaService: FacturaService,
    private rolesService: RolesService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuth();
    setTimeout(() => this.ver(), 500);
  }

  isAuth(): void {
    this.usuarioService.isAuth().subscribe((resA) => {
      const email = resA.email;
      this.rolesService.getEmail(email).subscribe((resR) => {
        this.usuario = resR;
      });
    });
  }
  public ver(): void {
    if (this.usuario === null) {
      setTimeout(() => this.r(), 500);
    } else if (
      this.usuario.rol.toLocaleLowerCase() !== 'delivery' &&
      this.usuario.rol.toLocaleLowerCase() !== 'administrador'
    ) {
      setTimeout(() => this.r(), 500);
    } else {
      this.cargarLocalidades();
      setInterval(() => {
        this.cargarPedidos();
      }, 5000);
    }
  }
  public r(): void {
    this.router.navigate(['']);
  }

  aceptarPedido(index: number): void {
    const pedido = this.pedidos[index];
    this.pedidoService.updateEstado(4, pedido).subscribe(() => {
      this.pedidosAceptados.push(pedido);
      this.pedidos.splice(index, 1);
    });
  }
  cargarLocalidades(): void {
    this.localidadService.getAll().subscribe((localidades) => {
      this.localidades = localidades;
    });
  }
  cargarPedidos(): void {
    this.pedidoService.getPedidos().subscribe((pedidos) => {
      pedidos.forEach((pedidoU) => {
        if (pedidoU.envioDelivery) {
          this.pedidoService.getOne(pedidoU.id).subscribe((pedi) => {
            if (pedi.estado.nombre === 'Terminado') {
              if (pedidos.length === 0) {
                this.pedidosUnit(pedi, true);
              } else {
                let bool = true;
                for (const pedidoUnitario of this.pedidos) {
                  if (pedidoUnitario.id === pedi.id) {
                    bool = false;
                    break;
                  }
                }
                if (bool) {
                  this.pedidosUnit(pedi, true);
                }
              }
            } else if (pedi.estado.nombre === 'En Delivery') {
              if (pedidos.length === 0) {
                this.pedidosUnit(pedi, false);
              } else {
                let bool = true;
                for (const pedidoUnitario of this.pedidosAceptados) {
                  if (pedidoUnitario.id === pedi.id) {
                    bool = false;
                    break;
                  }
                }
                if (bool) {
                  this.pedidosUnit(pedi, false);
                }
              }
            }
          });
        }
      });
    });
  }
  pedidosUnit(pedidoU: Pedido, bool: boolean): void {
    this.facturaService.getAll().subscribe((facturas) => {
      facturas.forEach((factura) => {
        if (factura.pedido.id === pedidoU.id) {
          this.total.push(factura.total);
          this.tipoPago.push(factura.tipoPago);
          if (bool) {
            this.pedidos.push(pedidoU);
          } else {
            this.pedidosAceptados.push(pedidoU);
          }
        }
      });
    });
  }
  pedidoEntregado(id: number): void {
    for (let indxCom = 0; indxCom < this.pedidos.length; indxCom++) {
      if (this.pedidos[indxCom].id === id) {
        this.pedidos.splice(indxCom, 1);
        break;
      }
    }
  }
}
