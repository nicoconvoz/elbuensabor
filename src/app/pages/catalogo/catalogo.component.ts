import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/Categoria';
import { Plato } from '../../models/Plato';
import { CategoriaService } from '../../services/allServices/categoria.service';
import { PlatoService } from '../../services/allServices/plato.service';
import { InsumoService } from '../../services/allServices/insumo.service';
import { Detalle } from 'src/app/models/Detalle';
import { Pedido } from './../../models/Pedido';
import { PedidoService } from './../../services/allServices/pedido.service';
import { Insumo } from 'src/app/models/Insumo';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { RolesService } from 'src/app/services/allServices/roles.service';
import { Usuario } from 'src/app/models/Usuario';
import { DetalleService } from 'src/app/services/allServices/detalle.service';
import { Estado } from 'src/app/models/Estado';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  vcategoria: string = null;
  public categorias: Categoria[];
  public platos: Plato[];
  public platosAux: Plato[];
  public platosCarrito: Plato[] = [];
  gaseosas: Insumo[] = [];
  total: number = 0;
  platoDetalle: Plato = {};
  seleccionBebidas: boolean = false;
  stock: boolean;
  //variables pedido
  carritoFinal: Detalle[] = [];
  carritoBebidas: Detalle[] = [];
  pedidoNuevo: Pedido = {};
  usuario: Usuario = {};
  ultimopedido: Pedido;
  public pedidos: Pedido[] = [];

  fechahoy: boolean = false;

  constructor(private servicioCategoria: CategoriaService,
    private servicioPlato: PlatoService,
    private servicioBebida: InsumoService,
    private servicioPedido: PedidoService,
    private usuarioServicio: UsuarioService,
    private rolesServicio: RolesService,
    private detalleService: DetalleService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCategorias();
    this.isAuth();
    this.establecerFechas();
  }

  onKeyFilter(value) {
    var filter = value.toLowerCase();
    var platosFiltrados = [];
    for (let i = 0; i < this.platosAux.length; i++) {
      if (this.platosAux[i].nombre.toLowerCase().includes(filter)) {
        platosFiltrados.push(this.platosAux[i]);
        this.platos = platosFiltrados;
      }
    }
    if (filter == '') {
      this.platos = this.platosAux;
    }
  }

  establecerFechas() {
    /*let dia = new Date().getDay();
    let hora = new Date().getHours();
    let minutos = new Date().getMinutes();*/
    let dia = 1;
    let hora = 20;
    let minutos = 59;
    //lunes a domingos de 20:00 a 12:00, y de sábados y domingos de 11:00 a 15:00
    if (hora >= 20 || (hora == 0 && minutos == 0)) {
      this.fechahoy = true;
    }

    if (dia == 0 || dia == 7) {
      if (hora >= 11 && hora <= 15) {
        this.fechahoy = true;
      }
    }

  }

  volverANulo() {
    this.vcategoria = null;
  }

  getBebidas() {
    this.seleccionBebidas = true;
    this.servicioBebida.getEsInsumo(false).subscribe(res => {
      this.gaseosas = res;
    }, err => {
    });
  }

  getCategorias() {
    this.servicioCategoria.getAll().subscribe(res => {
      this.categorias = res;
    }, err => {
    });
  }

  elegirCategoria(categoria: string) {
    this.seleccionBebidas = false;
    this.vcategoria = categoria;
    this.servicioPlato.getByCategory(categoria).subscribe(res => {
      this.platos = res;
      this.platosAux = res;
    }, err => {
    });
  }

  agregarGaseosa(bebida) {
    let nuevoDetalle: Detalle = {};
    if (this.carritoBebidas.length < 1) {
      nuevoDetalle.insumo = bebida;
      nuevoDetalle.cantidad = 1;
      this.carritoBebidas.push(nuevoDetalle);
      this.total += bebida.precioVenta;
    } else {
      let otro: Detalle = {};
      otro.insumo = bebida;
      const indice = this.carritoBebidas.findIndex(ref => ref.insumo.nombre == otro.insumo.nombre);
      if (indice < 0) {
        let nuevoPlato: Detalle = {};
        nuevoPlato.insumo = bebida;
        nuevoPlato.cantidad = 1;
        this.carritoBebidas.push(nuevoPlato);
        this.total += bebida.precioVenta;
        const nuevoIndice = this.carritoBebidas.findIndex(ref => ref.insumo.nombre == otro.insumo.nombre);
      } else {
        this.carritoBebidas[indice].cantidad++;
        this.total += bebida.precioVenta;
      }
    }
  }

  eliminarItem(detalle: Detalle) {
    if (detalle.plato != null) {
      const nombreplato = detalle.plato.nombre;
      const indexPlato = this.carritoFinal.findIndex(ref => ref.plato.nombre == nombreplato);
      if (this.carritoFinal[indexPlato].cantidad > 1) {
        this.carritoFinal[indexPlato].cantidad--;
        this.total = this.total - detalle.plato.precioVenta;
      } else {
        this.carritoFinal.splice(indexPlato, 1);
        this.total = this.total - detalle.plato.precioVenta;
      }
    } else if (detalle.insumo != null) {
      const nombre = detalle.insumo.nombre;
      const index = this.carritoBebidas.findIndex(ref => ref.insumo.nombre == nombre);
      if (this.carritoBebidas[index].cantidad > 1) {
        this.carritoBebidas[index].cantidad--;
        this.total = this.total - detalle.insumo.precioVenta;
      } else {
        this.carritoBebidas.splice(index, 1);
        this.total = this.total - detalle.insumo.precioVenta;
      }
    }

  }

  isAuth() {
    this.usuarioServicio.isAuth().subscribe(res => {
      const email = res.email;
      this.rolesServicio.getEmail(email).subscribe(res => {
        this.usuario = res;
      })
    });
  }

  enviarPedidoFinal() {
    if (this.fechahoy == true) {
      this.servicioPedido.getPedidoEstado(this.usuario.id, 7).subscribe(res => {
        this.pedidos = res;
        if (this.pedidos.length > 0) {
          this.updatePedido();
        } else {
          this.setearPedido();
        }
      })
    }
  }

  updatePedido() {
    const arreglofinal = this.carritoFinal.concat(this.carritoBebidas);
    arreglofinal.forEach(element => {
      element.pedido = this.pedidos[0];
      this.detalleService.post(element).subscribe(
        () => { },
        err => {
        }
      );
    });
    this.router.navigate(['/carrito']);
  }

  setearPedido() {
    let estado: Estado = {
      id: 7,
      eliminado: false,
      nombre: 'En Pedido'
    };
    this.pedidoNuevo.usuario = this.usuario;
    this.pedidoNuevo.estado = estado;
    this.pedidoNuevo.eliminado = false;
    this.servicioPedido.post(this.pedidoNuevo).subscribe(res => {
      this.ultimopedido = res;
      this.setearDetalles();
    });
  }

  setearDetalles() {
    
    const arreglofinal = this.carritoFinal.concat(this.carritoBebidas);
    arreglofinal.forEach(element => {
      element.pedido = this.ultimopedido;
      element.fecha = new Date (Date.now());
      this.detalleService.post(element).subscribe(
        () => { },
        err => {
          
        }
      );
    });
    this.router.navigate(['/carrito']);
  }

  verDetalle(plato: Plato) {
    this.platoDetalle = plato;
  }

  agregarAlPedido(plato: Plato) {
    this.servicioPlato.consultarStock(plato.id, 1).subscribe(
      res => {
        this.stock = res;
        if (res === true) {
          let nuevoDetalle: Detalle = {};
          if (this.carritoFinal.length < 1) {
            nuevoDetalle.plato = plato;
            nuevoDetalle.cantidad = 1;
            this.carritoFinal.push(nuevoDetalle);
            this.total += plato.precioVenta;
          } else {
            let otro: Detalle = {};
            otro.plato = plato;
            const indice = this.carritoFinal.findIndex(ref => ref.plato.nombre == otro.plato.nombre);
            if (indice < 0) {
              let nuevoPlato: Detalle = {};
              nuevoPlato.plato = plato;
              nuevoPlato.cantidad = 1;
              this.carritoFinal.push(nuevoPlato);
              this.total += plato.precioVenta;
              const nuevoIndice = this.carritoFinal.findIndex(ref => ref.plato.nombre == otro.plato.nombre);
            } else {
              this.carritoFinal[indice].cantidad++;
              let nuevaCantidad = this.carritoFinal[indice].cantidad;
              this.servicioPlato.consultarStock(plato.id, nuevaCantidad).subscribe(
                ref => {
                  if (ref === true) {
                    this.total += plato.precioVenta;
                  } else {
                    this.carritoFinal[indice].cantidad--;
                    Swal.fire({
                      icon: 'error',
                      title: 'No hay suficiente stock para ' + plato.nombre,
                      showConfirmButton: false,
                      timer: 1500
                    })
                  }
                },
                err => { }
              );
            }
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'No hay suficiente stock para ' + plato.nombre,
            showConfirmButton: false,
            timer: 1500
          })

        }
      },
      err => {
      }
    );
  }

}
