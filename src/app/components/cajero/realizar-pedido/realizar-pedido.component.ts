import { FacturaService } from './../../../services/allServices/factura.service';
import { CategoriaInsumoService } from './../../../services/allServices/categoriaInsumo.service';
import { CategoriaInsumo } from './../../../models/CategoriaInsumo';
import { Insumo } from './../../../models/Insumo';
import { Detalle } from './../../../models/Detalle';
import { DetalleService } from './../../../services/allServices/detalle.service';
import { DomicilioService } from 'src/app/services/allServices/domicilio.service';
import { EstadoService } from './../../../services/allServices/estado.service';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { PedidoService } from './../../../services/allServices/pedido.service';
import { PlatoService } from './../../../services/allServices/plato.service';
import { CategoriaService } from './../../../services/allServices/categoria.service';
import { Pedido } from './../../../models/Pedido';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalRealizarPedidoUsuarioComponent } from '../modales/modal-realizar-pedido-usuario/modal-realizar-pedido-usuario.component';
import Swal from 'sweetalert2';
import { ModalRealizarPedidoDomicilioComponent } from '../modales/modal-realizar-pedido-domicilio/modal-realizar-pedido-domicilio.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario';
import { Domicilio } from 'src/app/models/Domicilio';
import { Estado } from 'src/app/models/Estado';
import { Plato } from 'src/app/models/Plato';
import { InsumoService } from 'src/app/services/allServices/insumo.service';
import { FaltanteStockComponent } from '../../administrador/faltante-stock/faltante-stock.component';
import { Factura } from 'src/app/models/Factura';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.component.html',
  styleUrls: ['./realizar-pedido.component.css']
})
export class RealizarPedidoComponent implements OnInit {

  public localDataCategorias: any;
  public localDataCategoriasInsumos: any;
  public localDataPlatos: any;
  public localDataInsumos: any;
  public usuario: Usuario;
  public domicilio: Domicilio;
  public estado: Estado;
  public pedido: Pedido;
  public factura: Factura;
  public pedidoSelec: Pedido;
  public platoSelec: Plato;
  public insumoSelec: Insumo;
  public localData: any = { ...this.pedido };
  public localDataFactura: any = { ...this.factura };
  public detalle: Detalle;
  public d: Detalle;
  public detalleInsumo: Detalle;
  public localDataD: any = { ...this.d };
  public localDataDetalle: any = { ...this.detalle };
  public localDataDetalles: any = this.detalle;
  public form3: FormGroup;
  public form4: FormGroup;
  public form5: FormGroup;
  public userId: number;
  public paso: number = 1;
  public domId: number;
  public llave: boolean = true;
  public retirarLocal: boolean = false;
  public contar: number = 0;
  public pedidosEnPreparacion;
  public primeraVuelta = false;
  public tiempoPedido = 0;
  public detallesEnPreparacion: Detalle[] = [];
  public cocineros;


  constructor(public dialog: MatDialog, public formBuilder3: FormBuilder, public formBuilder4: FormBuilder,
    public formBuilder5: FormBuilder,
    public service: CategoriaService,
    public service2: PlatoService, public service3: PedidoService, public service4: EstadoService,
    public service5: UsuarioService, public service6: DomicilioService, public service7: DetalleService,
    public service8: InsumoService, public service9: CategoriaInsumoService, public service10: FacturaService) { }

  ngOnInit(): void {
    this.getCocineros();
    this.buildForm3();
    this.buildForm4();
    this.buildForm5();
    this.getAllCategorias();

  }

  getCocineros() {
    this.service5.getCocineros().subscribe(res => {
      this.cocineros = res;
    });
  }

  getPedidosEnPreparacion() {
    this.service3.getPedidoEstado(this.usuario.id, 2).subscribe(res => {
      this.pedidosEnPreparacion = res;
      res.forEach(element => {
        this.getDetallesXPedidoEnPreparacion(element.id);
      });
    },
      () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'No se pudo recolectar la información del pedido!',
          showConfirmButton: false,
          timer: 1500
        });
      });
  }

  getDetallesXPedidoEnPreparacion(id: number) {
    this.service7.buscarPorPedido(id).subscribe(res => {
      if (this.primeraVuelta === false) {
        this.detallesEnPreparacion = res;
        this.primeraVuelta = true;
      } else {
        this.detallesEnPreparacion = this.detallesEnPreparacion.concat(res);
      }
    },
      () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'No se pudo recolectar la información del pedido!',
          showConfirmButton: false,
          timer: 1500
        });
      });
  }


  calcularTiempo(detalle: Detalle) {
    var tiempoSinCocineros = 0;
    let key: boolean = false;
    //this detalles en preparacion es lo que se encuentra en cocina, y le concateno el detalle que acabas de armar
    if (this.detallesEnPreparacion.length < 1) {
      this.detallesEnPreparacion.forEach(element => {
        if (element.id == detalle.id) {
          element.cantidad = detalle.cantidad;
          key = true;
        }
      });
      if (!key) {
        this.detallesEnPreparacion = this.detallesEnPreparacion.concat(detalle);
      }
    } else {
      this.detallesEnPreparacion = this.detallesEnPreparacion.concat(detalle);
    }
    for (let index = 0; index < this.detallesEnPreparacion.length; index++) {
      tiempoSinCocineros += this.detallesEnPreparacion[index].plato.tiempoPreparacion * this.detallesEnPreparacion[index].cantidad;
    }
    if (this.cocineros.length > 0) {
      this.tiempoPedido = tiempoSinCocineros / this.cocineros.length;
    } else {
      this.tiempoPedido = tiempoSinCocineros;
    }
    //Si el envio es delivery, le sumas 10 minutos.
    if (this.retirarLocal === true) {
      this.tiempoPedido += 10;
    }

    this.form3.controls['tiempoPreparacion'].setValue(this.tiempoPedido);

  }

  obtenerFecha(): String {
    var d = new Date();
    let mes: String;
    let dia: String;
    if ((d.getMonth() + 1) < 10) {
      mes = "0" + (d.getMonth() + 1);
    } else {
      mes = (d.getMonth() + 1).toString();
    }
    if (d.getDate() < 10) {
      dia = "0" + d.getDate();
    } else {
      dia = d.getDate().toString();
    }
    return d.getFullYear() + '-' + mes + '-' + dia;
  }

  public cargarPedido() {
    var d = new Date();
    this.form3.controls['fecha'].setValue(this.obtenerFecha());
    this.form3.controls['envioDelivery'].setValue(!this.retirarLocal);
    this.form3.controls['eliminado'].setValue(false);
    this.agregarEstado();
  }

  agregarEstado(): void {
    this.service4.getOne(5).subscribe(data => {
      this.estado = data;
      this.form3.controls['estado'].setValue(this.estado);
      this.agregarUsuario();
    });
  }
  agregarUsuario(): void {
    this.service5.getOne(this.userId).subscribe(data => {
      this.usuario = data;
      this.form3.controls['usuario'].setValue(this.usuario);
      this.agregarDomicilio();
      this.getPedidosEnPreparacion();
    });
  }

  agregarDomicilio(): void {
    if (this.domId == 0 || this.domId == null) {
      this.domId = 99;
    }
    this.service6.getOne(this.domId).subscribe(data => {
      this.domicilio = data;
      this.form3.controls['domicilio'].setValue(this.domicilio);
      this.crearPedido(this.form3.value);
    });

  }

  public crearPedido(element: Pedido) {
    if (element != null && element != undefined) {
      this.service3.post(element).subscribe((result) => {
        this.localData = { ...result };
        this.pedidoSelec = result;
        this.form3.controls['id'].setValue(result.id);
      });
    }
  }

  buildForm3() {
    this.form3 = this.formBuilder3.group({
      id: [this.localData.id],
      envioDelivery: [this.localData.envioDelivery],
      fecha: [this.localData.fecha],
      estado: [this.localData.estado],
      usuario: [this.localData.usuario],
      domicilio: [this.localData.domicilio],
      tiempoPreparacion: [this.localData.tiempoPreparacion],
      eliminado: [this.localData.eliminado]
    });

  }


  buildForm4() {
    this.form4 = this.formBuilder4.group({
      id: [this.localDataD.id],
      cantidad: [this.localDataD.cantidad],
      fecha: [this.localDataD.fecha],
      plato: [this.localDataD.plato],
      insumo: [this.localDataD.insumo],
      pedido: [this.localDataD.pedido],
      eliminado: [this.localDataD.eliminado]
    });

  }

  buildForm5() {
    this.form5 = this.formBuilder5.group({
      id: [this.localDataFactura.id],
      total: [this.localDataFactura.cantidad],
      usuario: [this.localDataFactura.plato],
      pedido: [this.localDataFactura.insumo],
      fecha: [this.localDataFactura.pedido],
      tipoPago: [this.localDataFactura.tipoPago],
      tipoFactura: [this.localDataFactura.tipoFactura],
      subtotal: [this.localDataFactura.subtotal],
      montoDescuento: [this.localDataFactura.montoDescuento],
      nroTarjeta: [this.localDataFactura.nroTarjeta],
      dniTitular: [this.localDataFactura.dniTitular],
      eliminado: [this.localDataFactura.eliminado]
    });

  }

  public getAllCategorias(): void {
    this.service.getAll().subscribe((data) => {
      this.localDataCategorias = data;
    });
    this.service9.buscarporCategoria().subscribe((data) => {
      this.localDataCategoriasInsumos = data;
    })

  }

  onSubmitUsuario(): void {
    this.dialog.open(ModalRealizarPedidoUsuarioComponent, { width: "1000px" })
      .afterClosed().subscribe(result => {
        this.cargarUsuario(result.data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario seleccionado correctamente!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  onSubmitDomicilio(op: boolean): void {
    if (op) {
      this.dialog.open(ModalRealizarPedidoDomicilioComponent, { width: "800px", data: this.userId })
        .afterClosed().subscribe(result => {
          this.cargarDomicilio(result.data);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Domicilio seleccionado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        });
    } else {
      this.retirarLocal = true;
      this.paso = 3;
      this.cargarPedido();
    }

  }

  public cargarUsuario(element: number) {
    this.userId = element;
    this.paso = 2;
  }

  public cargarDomicilio(element: number) {
    this.domId = element;
    this.paso = 3;
    this.cargarPedido();
  }
  public focusTarjeta(): void {
    (<HTMLInputElement>document.getElementById("tarjeta")).value = "";
  }
  public pagar(op: boolean): void {
    if (op) {
      if ((<HTMLInputElement>document.getElementById("tarjeta")).value.length == 16) {
        if( (<HTMLInputElement>document.getElementById("dni")).value.length > 6 ){
        this.form5.controls['nroTarjeta'].setValue((<HTMLInputElement>document.getElementById("tarjeta")).value);
        this.form5.controls['dniTitular'].setValue(Number.parseInt((<HTMLInputElement>document.getElementById("dni")).value));
        this.form5.controls['tipoPago'].setValue("Tarjeta");
        this.paso = 4;
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Número de DNI incorrecto!',
            showConfirmButton: false,
            timer: 1500
          }).finally(()=>{
            (<HTMLInputElement>document.getElementById("dni")).value = "";
            (<HTMLInputElement>document.getElementById("dni")).focus();
          });
        }
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Número de tarjeta incorrecto!',
          showConfirmButton: false,
          timer: 1500
        }).finally(()=>{
          (<HTMLInputElement>document.getElementById("tarjeta")).value = "";
          (<HTMLInputElement>document.getElementById("tarjeta")).focus();
        });
        
      }
    } else {
      this.form5.controls['tipoPago'].setValue("Efectivo");
      this.paso = 4;
    }

  }

  public inputValidator(event: any) {
    const pattern = /^[0-9]*$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
      // invalid character, prevent input

    }
  }
  public crearDetallePlato(element: Plato): void {
    this.service7.buscarPorPlato(this.pedidoSelec.id, element.id).subscribe((data) => {
      this.service2.consultarStock(element.id, 1).subscribe((stock) => {
        if (stock) {
          let contador: number = 0;
          this.contar++;
          data.forEach(element => {
            contador += 1;
          });
          this.platoSelec = element;
          if (contador == 0) {
            this.form4.controls['cantidad'].setValue(1);
            this.form4.controls['fecha'].setValue(this.obtenerFecha());
            this.form4.controls['plato'].setValue(element);
            this.form4.controls['insumo'].setValue(null);
            this.form4.controls['pedido'].setValue(this.pedidoSelec);
            this.form4.controls['eliminado'].setValue(false);
            this.postDetalle();
          }
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No hay stock suficiente para ' + element.nombre + '',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    });

  }

  public crearDetalleInsumo(element: Insumo): void {
    this.service7.buscarPorInsumo(this.pedidoSelec.id, element.id).subscribe((data) => {
      let contador: number = 0;
      this.contar++;
      data.forEach(element => {
        contador += 1;
      });
      this.insumoSelec = element;
      if (contador == 0) {
        this.form4.controls['cantidad'].setValue(1);
        this.form4.controls['fecha'].setValue(this.obtenerFecha());
        this.form4.controls['insumo'].setValue(element);
        this.form4.controls['plato'].setValue(null);
        this.form4.controls['pedido'].setValue(this.pedidoSelec);
        this.form4.controls['eliminado'].setValue(false);
        this.postDetalle();
      }
    });

  }

  public postDetalle(): void {
    this.service7.post(this.form4.value).subscribe((data) => {
      this.getAllDetalles();
      let key: boolean = false;
      this.service7.getOne(data.id).subscribe((data2) => {
        this.calcularTiempo(data2);
      })
    });
  }

  public getAllDetalles(): void {
    this.service7.buscarPorPedido(this.pedidoSelec.id).subscribe((data) => {
      this.localDataDetalles = data;
      this.getOnePedido();
    })
  }

  public getOnePedido(): void {
    this.service3.getOne(this.pedidoSelec.id).subscribe((data) => {
      this.pedidoSelec = data;
      if (this.retirarLocal) {
        (<HTMLInputElement>document.getElementById("total")).value = ((this.pedidoSelec.monto - (this.pedidoSelec.monto * 0.1)).toFixed(2)).toString();
      } else {
        (<HTMLInputElement>document.getElementById("total")).value = this.pedidoSelec.monto.toFixed(2).toString();
      }
    });
  }

  public buscarPlatos(id: number): void {
    this.service2.buscarPlatoPorCategoria(id).subscribe(data => {
      this.localDataPlatos = data;
      this.localDataInsumos = null;
    });

  }

  public buscarInsumos(id: number): void {
    this.service8.buscarPorCategoriaNoInsumo(id).subscribe(data => {
      this.localDataInsumos = data;
      this.localDataPlatos = null;
    });

  }

  public cantidad(incrementar: boolean, detalle: Detalle): void {
    let cantidad: number = 0;
    if (this.llave) {
      if (incrementar) {
        cantidad = Number.parseInt((<HTMLInputElement>document.getElementById("cantidad_" + detalle.id.toString())).value) + 1;
        this.actualizarDetalle(cantidad, detalle, false);
        this.contar++;
      } else {
        cantidad = Number.parseInt((<HTMLInputElement>document.getElementById("cantidad_" + detalle.id.toString())).value) - 1;
        this.contar--;
        if (cantidad == 0) {
          this.actualizarDetalle(1, detalle, true);
        } else {
          this.actualizarDetalle(cantidad, detalle, false);
        }
      }

    }
    this.llave = false;
  }



  public actualizarDetalle(cantidad: number, detalle: Detalle, eliminado: boolean): void {
    this.form4.controls['id'].setValue(detalle.id);
    this.form4.controls['cantidad'].setValue(cantidad);
    this.form4.controls['plato'].setValue(detalle.plato);
    this.form4.controls['pedido'].setValue(detalle.pedido);
    this.form4.controls['insumo'].setValue(detalle.insumo);
    this.form4.controls['eliminado'].setValue(eliminado);
    this.service7.put(detalle.id, this.form4.value).subscribe((data) => {
      this.service7.getOne(detalle.id).subscribe((data2) => {
        this.calcularTiempo(data2);
      });
      this.getAllDetalles();
      this.llave = true;
    });
  }

  public terminarPedido(): void {

    this.form5.controls['id'].setValue(null);

    this.form5.controls['fecha'].setValue(this.obtenerFecha());
    this.form5.controls['pedido'].setValue(this.pedidoSelec);
    this.form5.controls['usuario'].setValue(this.usuario);

    if (this.retirarLocal) {
      this.form5.controls['subtotal'].setValue((this.pedidoSelec.monto).toFixed(2));
      this.form5.controls['total'].setValue((this.pedidoSelec.monto - (this.pedidoSelec.monto * 0.1)).toFixed(2));
      this.form5.controls['montoDescuento'].setValue((this.pedidoSelec.monto * 0.1).toFixed(2));
    } else {
      this.form5.controls['subtotal'].setValue(this.pedidoSelec.monto.toFixed(2));
      this.form5.controls['total'].setValue(this.pedidoSelec.monto.toFixed(2));
      this.form5.controls['montoDescuento'].setValue(0);
    }
    this.form5.controls['tipoFactura'].setValue("C");
    this.form5.controls['eliminado'].setValue(false);


    this.service10.post(this.form5.value).subscribe(data => {
      this.paso = 5;
      this.service3.put(this.pedidoSelec.id, this.form3.value).subscribe(data2 => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡El tiempo de su pedido es de ' + this.tiempoPedido + 'min!',
          showConfirmButton: false
        });
      });
    });


  }

  public reiniciarPedido(): void {
    this.userId = null;
    this.domId = null;
    this.pedidoSelec = null;
    this.platoSelec = null;
    this.usuario = null;
    this.detalle = null;
    this.domicilio = null;
    this.estado = null;
    this.paso = 1;
    this.retirarLocal = false;
    this.localData = null;
    this.localDataDetalle = null;
    this.localDataDetalles = null;
    this.localDataPlatos = null;
    this.detallesEnPreparacion = null;
    this.tiempoPedido = 0;
  }

}
