import { ConfiguracionEmpresa } from './../../models/ConfiguracionEmpresa';
import { ConfiguracionService } from './../../services/allServices/configuracion.service';
import { Pedido } from 'src/app/models/Pedido';
import { DetalleService } from 'src/app/services/allServices/detalle.service';
import { Factura } from './../../models/Factura';
import { FacturaService } from 'src/app/services/allServices/factura.service';
import { PedidoService } from 'src/app/services/allServices/pedido.service';
import { RolesService } from './../../services/allServices/roles.service';
import { UsuarioService } from './../../services/allServices/usuario.service';
import { Usuario } from 'src/app/models/Usuario';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-facturapdf',
  templateUrl: './facturapdf.component.html',
  styleUrls: ['./facturapdf.component.css']
})
export class FacturapdfComponent implements OnInit {

  public envio;
  public cargarFactura = false;
  public cargarEmpresa = false;
  public facturas: Factura[] = [];
  public pedidoId;
  public facturaObtenida: Factura;
  public reformatDate;
  public detalles;
  public pedidoObtenido: Pedido;
  public domicilios;
  public usuario: Usuario = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: null,
    eliminado: false,
    dni: 0,
    imagen: '',
    rol: '',
    esCliente: true,
    telefono: 0
  }
  public empresa: ConfiguracionEmpresa = {
    id: 0,
    nombre: '',
    cantidadCocineros: 0,
    cuit: 0,
    email: '',
    numeroFiscal: 0,
    sociedad: '',
    telefono: 0,
    eliminado: false,
  }

  constructor(private usuarioService: UsuarioService, private rolesService: RolesService,
    private datePipe: DatePipe, private pedidoService: PedidoService, private detalleService: DetalleService,
    private facturaService: FacturaService, private actRouter: ActivatedRoute,
    private empresaService: ConfiguracionService) {
  }

  ngOnInit() {
    this.getEmpresa();
    this.actRouter.params.subscribe(data => {
      this.pedidoId = data['id'];
      console.log(this.pedidoId);
    })
    this.getAllFacturas();
    this.isAuth();
  }

  getEmpresa(){
    this.empresaService.getOne(1).subscribe(res=>{
      this.empresa = res;
      console.log(this.empresa);
      this.cargarEmpresa = true;
    })
  }

  isAuth() {
    this.usuarioService.isAuth().subscribe(res => {
      const email = res.email;
      this.rolesService.getEmail(email).subscribe(res => {
        this.usuario = res;
        this.reformatDate = this.datePipe.transform(this.usuario.fechaNacimiento, "yyyy-MM-dd");
        this.getPedido();
      })
    });
  }

  getAllFacturas() {
    this.facturaService.getAll().subscribe(res => {
      this.facturas = res;
    })
  }

  getPedido() {
    this.pedidoService.getOne(this.pedidoId).subscribe(res => {
      this.pedidoObtenido = res;
      this.obtenerFacturaDePedido();
      this.pedidoObtenido.envioDelivery === true ? this.envio = 'Delivery' : this.envio = 'Retiro en Local';
      this.getDetallesXPedido();
    })
  }

  getDetallesXPedido() {
    this.detalleService.buscarPorPedido(this.pedidoId).subscribe(res => {
      this.detalles = res;
      console.log('Detalles: ',this.detalles);
    })
  }

  obtenerFacturaDePedido() {
    for (let index = 0; index < this.facturas.length; index++) {
      if (this.facturas[index].pedido.id === this.pedidoObtenido.id) {
        this.facturaObtenida = this.facturas[index];
        this.cargarFactura = true;
      }
    }
  }

  downloadFactura() {
    var element = document.getElementById('fact');
    html2canvas(element).then((canvas) => {
      console.log(canvas);
      var imgData = canvas.toDataURL('image/png');
      var doc = new jspdf();
      var imgHeight = canvas.height * 208 / canvas.width;
      doc.addImage(imgData, 0, 0, 208, imgHeight);
      doc.save("factura.pdf");
    })
  }

}