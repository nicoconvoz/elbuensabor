import { Component, OnInit, Input } from '@angular/core';
import { PedidoService } from '../../services/allServices/pedido.service';
import { DetalleService } from '../../services/allServices/detalle.service';
import { InsumoService } from '../../services/allServices/insumo.service';
import { PlatoService } from '../../services/allServices/plato.service';
import { Plato } from '../../models/Plato';
import { Pedido } from '../../models/Pedido';
import { Detalle } from '../../models/Detalle';
import { DetallePlato } from '../../models/DetallePlato';
import { Usuario } from 'src/app/models/Usuario';
import { RolesService } from 'src/app/services/allServices/roles.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
})
export class CocinaComponent implements OnInit {
  comandas: Pedido[] = [];
  recetas: Plato[] = [];
  filterB = '';
  modalNombre = '';
  modalDetalle: DetallePlato[] = [];
  spinner = true;
  detalles: Detalle[] = [];
  platos: Plato[] = [];

  public usuario: Usuario;

  constructor(
    private pedidoService: PedidoService,
    private platoService: PlatoService,
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
      this.usuario.rol.toLocaleLowerCase() !== 'cocinero' &&
      this.usuario.rol.toLocaleLowerCase() !== 'administrador'
    ) {
      setTimeout(() => this.r(), 500);
    } else {
      setInterval(() => {
        this.cargarComandas();
      }, 5000);
      this.cargarRecetas();
    }
  }
  public r(): void {
    this.router.navigate(['']);
  }

  modalDatos(nombre: string, detalle: DetallePlato[]): void {
    this.modalNombre = nombre;
    this.modalDetalle = detalle;
  }
  cargarComandas(): void {
    this.pedidoService.getPedidos().subscribe((pedidos) => {
      pedidos.forEach((pedido) => {
        let bol = true;
        for (let iCom = 0; iCom < this.comandas.length; iCom++) {
          if (pedido.id === this.comandas[iCom].id) {
            this.pedidoService.getOne(pedido.id).subscribe((pedidoUnit) => {
              if (pedidoUnit.estado.nombre === 'Cancelado') {
                this.comandas.splice(iCom, 1);
              }
            });
            bol = false;
            break;
          }
        }
        if (bol) {
          this.pedidoService.getOne(pedido.id).subscribe((pedidoUnit) => {
            if (pedidoUnit.estado.nombre === 'En Preparacion') {
              this.comandas.push(pedidoUnit);
            }
          });
        }
      });
    });
    this.comandas.length > 0 ? (this.spinner = false) : (this.spinner = true);
  }
  cargarRecetas(): void {
    this.platoService.getAll().subscribe((platos) => {
      platos.forEach((platoU) => {
        this.recetas.push(platoU);
      });
    });
  }
  eliminarComanda(id: number): void {
    for (let indxCom = 0; indxCom < this.comandas.length; indxCom++) {
      if (this.comandas[indxCom].id === id) {
        this.comandas.splice(indxCom, 1);
        break;
      }
    }
  }
}
