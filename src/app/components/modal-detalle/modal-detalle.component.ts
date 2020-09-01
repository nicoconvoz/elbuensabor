import { Pedido } from 'src/app/models/Pedido';
import { RolesService } from './../../services/allServices/roles.service';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { Usuario } from 'src/app/models/Usuario';
import { PedidoService } from 'src/app/services/allServices/pedido.service';
import { SweetAlertsService } from './../../services/allServices/sweet-alerts.service';
import { Detalle } from './../../models/Detalle';
import { DetalleService } from './../../services/allServices/detalle.service';
import { CarritoComponent } from './../../pages/carrito/carrito.component';
import { Component, OnInit, ViewChild, ElementRef, Host, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.css']
})

export class ModalDetalleComponent implements OnInit {

  @ViewChild('btnClose', { static: true }) btnClose: ElementRef;

  public formDetalle: FormGroup;
  public detalle: any;
  public usuario: Usuario;
  public pedidos: Pedido [] = [];

  ngOnInit() {
    this.onBuild();
  }

  constructor(private detalleService: DetalleService, @Host() private tabla: CarritoComponent,
    private formBuilder: FormBuilder, private pedidoService: PedidoService, 
    private usuarioService: UsuarioService, private rolesService: RolesService, 
    private alertsService: SweetAlertsService) { }

  @Input() set detalleSeleccionado(valor) {
    this.onBuild();
    if (valor) {
      this.detalle = valor;
      this.formDetalle.patchValue({
        id: valor.id,
        cantidad: valor.cantidad,
        nombre: valor.plato.nombre,
        precioVenta: valor.plato.precioVenta
      });
    }
  }

  onBuild() {
    this.formDetalle = this.formBuilder.group({
      id: null,
      nombre: new FormControl({ value: '', disabled: true }, [Validators.required]),
      cantidad: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      precioVenta: new FormControl({ value: '', disabled: true }, [Validators.required])
    });
  }

  onSave(formDetalle: FormGroup): void {
    if (formDetalle.value.id !== null) {
      this.update(formDetalle.value);
    }
    this.btnClose.nativeElement.click();
  }

  update(detalle: Detalle) {
    this.detalleService.put(detalle.id, detalle).subscribe(
      () => {
        const indexDom = this.tabla.detalles.filter(x => x.id === detalle.id);
        let posicion = this.tabla.detalles.findIndex(ref => ref.id === indexDom[0].id);
        this.tabla.detalles.splice(posicion, 1, detalle);
        this.tabla.getPedidosXUsuario();
        this.alertsService.successAlert('El carrito fue actualizado con éxito.');
      },
      () => {
        this.alertsService.errorAlert('Opps... :(', 'Algo salió mal actualizando el carrito');
      }
    );
  }

  refreshCarrito(id: number) {
    this.detalle.buscarPorPedido(id).subscribe(response => {
      this.tabla.detalles = response;
    });
  }

  onClose() {
    this.detalleSeleccionado = null;
  }

}