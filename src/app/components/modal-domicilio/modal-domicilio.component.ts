import { CarritoComponent } from './../../pages/carrito/carrito.component';
import { SweetAlertsService } from './../../services/allServices/sweet-alerts.service';
import { DomicilioService } from './../../services/allServices/domicilio.service';
import { UsuarioService } from './../../services/allServices/usuario.service';
import { LocalidadService } from './../../services/allServices/localidad.service';
import { RolesService } from './../../services/allServices/roles.service';
import { Domicilio } from './../../models/Domicilio';
import { Usuario } from './../../models/Usuario';
import { Component, OnInit, ViewChild, ElementRef, Input, Host } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-domicilio',
  templateUrl: './modal-domicilio.component.html',
  styleUrls: ['./modal-domicilio.component.css']
})
export class ModalDomicilioComponent implements OnInit {

  @ViewChild('btnClose', { static: true }) btnClose: ElementRef;

  public formDomicilio: FormGroup;
  public domicilio: Domicilio;
  public idPropietario: number;
  public domicilios;
  public localidades;
  public edit: boolean = false;
  public idPersona: number;
  public localidadSeleccionada;
  usuario: Usuario = {
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

  @Input() set id(valor: number) {
    if (valor) {
      this.idPropietario = valor;
    }
  }

  @Input() set domicilioSeleccionado(valor) {
    this.onBuild();
    if (valor) {
      this.domicilio = valor;
      this.formDomicilio.patchValue({
        id: valor.id,
        calle: valor.calle,
        numero: valor.numero,
        departamento: valor.departamento,
        piso: valor.piso,
        propietario: valor.propietario,
        localidad: valor.localidad
      });
      if (valor.id !== 0 || valor.id === null) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    }
  }

  constructor(@Host() private carrito: CarritoComponent,private servicio: DomicilioService, 
    private localidadService: LocalidadService, private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService, private rolesService: RolesService, 
    private alertsService: SweetAlertsService) { }

  ngOnInit() {
    this.onBuild();
    this.isAuth();
    this.getLocalidades();
  }

  onBuild() {
    this.formDomicilio = this.formBuilder.group({
      id: null,
      calle: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      departamento: new FormControl('', [Validators.required]),
      piso: new FormControl('', [Validators.required]),
      propietario: this.formBuilder.group({
        id: ''
      }),
      localidad: this.formBuilder.group({
        id: new FormControl('', [Validators.required])
      })
    });
  }

  isAuth() {
    this.usuarioService.isAuth().subscribe(res => {
      const email = res.email;
      this.rolesService.getEmail(email).subscribe(res => {
        this.usuario = res;
      })
    });
  }

  getLocalidades(){
    this.localidadService.getAll().subscribe( response => {
      this.localidades = response;
    })
  }

  onSave(formDomicilio: FormGroup): void {
    formDomicilio.value.propietario.id = this.usuario.id;
    formDomicilio.value.localidad.id = this.localidadSeleccionada;
    formDomicilio.value.eliminado = false;
    this.btnClose.nativeElement.click();
    this.addDomicilio(formDomicilio.value);
  }

  addDomicilio(domicilio: Domicilio) {
    this.servicio.post(domicilio).subscribe(
      res => {
        this.alertsService.successAlert('El domicilio fue agregado correctamente');
        this.carrito.domicilios.push(res);
      },
      () => {
        this.alertsService.errorAlert('Opps...','Ocurrió un error agregando el domicilio');
      }
    );
  }

  onLocalidadChange(value){
    const localidadFiltrada = this.localidades.filter(x => x.nombre === value);
    this.localidadSeleccionada = localidadFiltrada[0].id;
  }

  onReset(){
    this.domicilioSeleccionado = null;
  }

}
