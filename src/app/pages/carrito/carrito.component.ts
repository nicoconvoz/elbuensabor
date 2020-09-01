import { Factura } from './../../models/Factura';
import { FacturaService } from './../../services/allServices/factura.service';
import { Router } from '@angular/router';
import { Estado } from 'src/app/models/Estado';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/allServices/pedido.service';
import { SweetAlertsService } from './../../services/allServices/sweet-alerts.service';
import { UsuarioService } from './../../services/allServices/usuario.service';
import { RolesService } from './../../services/allServices/roles.service';
import { Usuario } from 'src/app/models/Usuario';
import { DomicilioService } from './../../services/allServices/domicilio.service';
import { DetalleService } from './../../services/allServices/detalle.service';
import { Domicilio } from './../../models/Domicilio';
import { Detalle } from './../../models/Detalle';
import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})

export class CarritoComponent implements OnInit {
  public detalles: Detalle[] = [];
  public domicilios: Domicilio[];
  public cocineros;
  public pedidosEnPreparacion;
  public detallesEnPreparacion;
  public idPersona: number;
  public flagRadioDireccion = false;
  public habilitarTarjeta = true;
  public numeroTarjeta;
  public dniTitularTarjeta;
  public flagTarjeta;
  public habilitarBotonFinal = true;
  public usuario: Usuario;
  public pedidos: Pedido[] = [];
  public direccionElegida;
  public primeraVuelta = false;
  public tiempoPedido = 0;
  public detalleSeleccionado: Detalle = {
    id: 0,
    cantidad: 0,
    plato: null,
    insumo: null,
    eliminado: false
  };
  public estado: Estado = {
    id: 5,
    eliminado: false,
    nombre: 'En Aprobacion'
  };
  public domBuenSabor: Domicilio = {
    id: 99,
    calle: 'El Buen Sabor',
    numero: 1,
    eliminado: false,
    departamento: 'Cero',
    piso: 'Cero',
    localidad: null,
    propietario: null
  };

  @Input() set id(valor: number) {
    if (valor) {
      this.idPersona = this.usuario.id;
    }
  }

  constructor(private detalleService: DetalleService, private rolesService: RolesService,
    private usuarioService: UsuarioService, private servicioDomicilio: DomicilioService,
    private pedidoService: PedidoService, private alertsService: SweetAlertsService,
    private router: Router, private facturaService: FacturaService) { }

  ngOnInit() {
    this.isAuth();
    this.getCocineros();
  }

  isAuth() {
    this.usuarioService.isAuth().subscribe(res => {
      const email = res.email;
      this.rolesService.getEmail(email).subscribe(res => {
        this.usuario = res;
        this.getAllDomiciliosXUsuario();
        this.getPedidosXUsuario();
        this.getPedidosEnPreparacion();
      })
    });
  }

  getAllDomiciliosXUsuario() {
    this.servicioDomicilio.buscarporUsuario(this.usuario.id).subscribe(res => {
      this.domicilios = res;
    })
  }

  getCocineros() {
    this.usuarioService.getCocineros().subscribe(res => {
      this.cocineros = res;
    });
  }

  getPedidosEnPreparacion() {
    this.pedidoService.getPedidoEstado(this.usuario.id, 2).subscribe(res => {
      this.pedidosEnPreparacion = res;
      if (this.pedidosEnPreparacion.length > 0) {
        res.forEach(element => {
          this.getDetallesXPedidoEnPreparacion(element.id);
        });
      }
    },
      () => {
        this.alertsService.errorAlert('Opss..', 'No se pudo recolectar la información del carrito');
      });
  }

  getDetallesXPedidoEnPreparacion(id: number) {
    this.detalleService.buscarPorPedido(id).subscribe(res => {
      if (this.primeraVuelta === false) {
        this.detallesEnPreparacion = res;
        this.primeraVuelta = true;
      } else {
        if (this.detallesEnPreparacion.length > 0 || this.detallesEnPreparacion !== undefined) {
          this.detallesEnPreparacion = this.detallesEnPreparacion.concat(res);
        } else {
        }
      }
    },
      () => {
        this.alertsService.errorAlert('Opss..', 'Carrito: Error en getDetallesXPedidoEnPreparación.');
      });
  }

  getPedidosXUsuario() {
    this.pedidoService.getPedidoEstado(this.usuario.id, 7).subscribe(res => {
      this.pedidos = res;
      res.forEach(element => {
        this.getDetallesXPedido(element.id);
      });
    },
      () => {
        this.alertsService.errorAlert('Opss..', 'Carrito: Error en getPediosXUsuario');
      });
  }

  getDetallesXPedido(id: number) {
    this.detalleService.buscarPorPedido(id).subscribe(res => {
      this.detalles = res;
    },
      () => {
        this.alertsService.errorAlert('Opss..', 'Carrito: Error en getDetallesXPedido');
      });
  }

  getTotalNeto(): number {
    let totalNeto = 0;
    var precioTotalXProducto = 0;
    for (let i = 0; i < this.detalles.length; i++) {
      if (this.detalles[i].plato == null) {
        precioTotalXProducto = this.detalles[i].insumo.precioVenta * this.detalles[i].cantidad;
        totalNeto += precioTotalXProducto;
      } else {
        precioTotalXProducto = this.detalles[i].plato.precioVenta * this.detalles[i].cantidad;
        totalNeto += precioTotalXProducto;
      }
    }
    return totalNeto;
  }

  getTotalFinal(): number {
    let totalNeto = this.getTotalNeto();
    let totalFinal = totalNeto - (totalNeto * 0.1);
    if (this.flagRadioDireccion) {
      return totalNeto;
    } else {
      return totalFinal;
    }
  }

  delete(detalle: Detalle) {
    return Swal.fire({
      title: 'Proceder con la eliminación?',
      text: 'El registro no podrá recuperarse',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminalo!'
    }).then(res => {
      if (res.value) {
        Swal.fire(
          'Eliminado!',
          'Su registro ha sido eliminado!',
          'success'
        )
        this.detalleService.delete(detalle.id).subscribe(
          () => {
            const indexDetalle = this.detalles.indexOf(detalle);
            this.detalles.splice(indexDetalle, 1);
          })
      }
    }).catch(() => {
      this.alertsService.errorAlert('Opps..', 'No se pudo eliminar el registro');
    })
  }

  onPreUpdate(detalle: Detalle) {
    this.detalleSeleccionado = detalle;
  }

  onRadioChange(value) {
    if (value === "local") {
      this.flagRadioDireccion = false;
      this.direccionElegida = undefined;
      this.habilitarTarjeta = true;
    } else {
      this.flagRadioDireccion = true;
      (<HTMLInputElement>document.getElementById("efecSeleccionado")).checked = true;
      this.habilitarTarjeta = false;
    }
    this.habilitarBtnFinal();
  }

  onRadioChangePago(value) {
    (value === "tarjeta") ? this.flagTarjeta = true : this.flagTarjeta = false;
    this.habilitarBtnFinal();
  }

  onChangeDireccion(value) {
    this.direccionElegida = this.domicilios.filter(x => x.calle === value);
    this.habilitarBtnFinal();
  }

  onRadioChangeNroTarjeta(value) {
    this.numeroTarjeta = value;
    this.habilitarBtnFinal();
  }

  onRadioChangeDNITarjeta(value) {
    this.dniTitularTarjeta = value;
    this.habilitarBtnFinal();
  }

  habilitarBtnFinal() {
    //Si es "retiro en local" y se paga con efectivo...
    if (this.flagRadioDireccion === false && (this.flagTarjeta === false || this.flagTarjeta === undefined)) {
      this.habilitarBotonFinal = true;
      //Si es "retiro en local" y se paga con tarjeta...
    } else if (this.flagRadioDireccion === false && this.flagTarjeta === true) {
      if ((this.numeroTarjeta != null && this.numeroTarjeta > 99999999) && this.dniTitularTarjeta > 999999) {
        this.habilitarBotonFinal = true
      } else {
        this.habilitarBotonFinal = false
      }
    }
    //Si es "Envio Delivery" y se paga con efectivo.
    if (this.flagRadioDireccion === true && this.direccionElegida === undefined) {
      this.habilitarBotonFinal = false;
    } else if (this.flagRadioDireccion === true && this.direccionElegida !== undefined) {
      this.habilitarBotonFinal = true;
    }
  }

  calcularTiempo() {
    var tiempoSinCocineros = 0;
    if (this.detallesEnPreparacion !== undefined) {
      this.detallesEnPreparacion = this.detallesEnPreparacion.concat(this.detalles);
    } else {
      this.detallesEnPreparacion = this.detalles;
    }
    for (let index = 0; index < this.detallesEnPreparacion.length; index++) {
      if (this.detallesEnPreparacion[index].plato !== null) {
        let cantidad = this.detallesEnPreparacion[index].cantidad;
        tiempoSinCocineros += this.detallesEnPreparacion[index].plato.tiempoPreparacion * cantidad;
      }
    }
    if (this.cocineros.length > 0) {
      this.tiempoPedido = tiempoSinCocineros / this.cocineros.length;
    } else {
      this.tiempoPedido = tiempoSinCocineros;
    }
    if (this.flagRadioDireccion === true) {
      this.tiempoPedido += 10;
    }
    return this.tiempoPedido;
  }

  realizarPedido() {
    try {
      this.pedidos[0].estado = this.estado;
      this.pedidos[0].envioDelivery = this.flagRadioDireccion;
      this.pedidos[0].fecha = new Date(Date.now());
      console.log('fecha: ',this.pedidos[0].fecha);
      this.pedidos[0].tiempoPreparacion = this.calcularTiempo();
      if (this.flagRadioDireccion === false) {
        this.pedidos[0].domicilio = this.domBuenSabor;
      } else {
        this.pedidos[0].domicilio = this.direccionElegida[0];
      }
      this.pedidos[0].monto = this.getTotalFinal();
      this.generarFactura();
      this.pedidoService.put(this.pedidos[0].id, this.pedidos[0]).subscribe(() => {
        this.sweetAlertEnviado();
      })
      this.redireccion();
    } catch (error) {
      this.alertsService.errorAlert('No se pudo enviar el pedido', 'Verifique que todo esté cargado.')
    }
  }

  generarFactura() {
    var tipoDePago;
    (this.flagTarjeta === true) ? tipoDePago = 'Tarjeta' : tipoDePago = 'Efectivo';
    const factura: Factura = {
      usuario: this.usuario,
      pedido: this.pedidos[0],
      tipoFactura: 'C',
      subtotal: this.getTotalNeto(),
      fecha: this.pedidos[0].fecha,
      tipoPago: tipoDePago,
      montoDescuento: (this.getTotalFinal() - this.getTotalNeto()) * -1,
      total: this.getTotalFinal(),
      nroTarjeta: this.numeroTarjeta,
      dniTitular: this.dniTitularTarjeta,
      detalle: this.detalles,
      eliminado: false
    }
    this.facturaService.post(factura).subscribe(res => {
    })
  }

  sweetAlertEnviado() {
    if (this.flagRadioDireccion === true) {
      Swal.fire(
        'Su pedido fue enviado! Ya posee su factura en su mail!',
        "De acuerdo al tiempo de espera, en " + this.tiempoPedido + " minutos llegará a su domicilio. <br/> Recuerde que tambien puede consultar su factura y el estado de su pedido en 'Mi Perfil'.",
        'success'
      )
    } else {
      Swal.fire(
        'Su pedido fue enviado! Ya posee su factura en su mail!',
        "De acuerdo al tiempo de espera, en " + this.tiempoPedido + " minutos estará listo para retirar. <br/> Recuerde que tambien puede consultar su factura y el estado de su pedido en 'Mi Perfil'.",
        'success'
      )
    }
  }

  redireccion() {
    if (this.usuario.rol === 'cliente' || this.usuario.rol === 'delivery' || this.usuario.rol === 'cocinero') {
      this.router.navigate(['/usuario']);
    } else {
      this.router.navigate(['/cajero']);
    }
  }
}