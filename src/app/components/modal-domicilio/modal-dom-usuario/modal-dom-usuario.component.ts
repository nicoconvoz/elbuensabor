import { PaginaPerfilComponent } from './../../../pages/pagina-perfil/pagina-perfil.component';
import { SweetAlertsService } from './../../../services/allServices/sweet-alerts.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { DomicilioService } from 'src/app/services/allServices/domicilio.service';
import { LocalidadService } from './../../../services/allServices/localidad.service';
import { RolesService } from './../../../services/allServices/roles.service';
import { Usuario } from 'src/app/models/Usuario';
import { Domicilio } from 'src/app/models/Domicilio';
import { Component, OnInit, ViewChild, ElementRef, Input, Host } from '@angular/core';

@Component({
  selector: 'app-modal-dom-usuario',
  templateUrl: './modal-dom-usuario.component.html',
  styleUrls: ['./modal-dom-usuario.component.css']
})
export class ModalDomUsuarioComponent implements OnInit {

  @ViewChild('btnClose', { static: true }) btnClose: ElementRef;

  public formDomicilio: FormGroup;
  public domicilio: Domicilio;
  public idPropietario: number;
  public domicilios;
  public localidades;
  public edit: boolean = false;
  public indiceP: number;
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
        localidad: valor.localidad.nombre,
      });
      if (valor.id !== 0 || valor.id === null) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    }
  }

  constructor(@Host() private tabla: PaginaPerfilComponent, private domicilioService: DomicilioService, 
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
    if (formDomicilio.value.id === null) {
      // Add
      this.addDomicilio(formDomicilio.value);
    } else {
      // Update
      this.updateDomicilio(formDomicilio.value);
    }
    this.btnClose.nativeElement.click();
    this.tabla.indice = null;
  }

  addDomicilio(domicilio: Domicilio) {
    this.domicilioService.post(domicilio).subscribe(
      res => {
        this.tabla.domicilios.push(res);
        this.alertsService.successAlert('El domicilio fue agregado correctamente');
      },
      () => {
        this.alertsService.errorAlert('Opps... :(', 'Ocurrió un error al agregar el domicilio');
      }
    );
  }

  updateDomicilio(domicilio: Domicilio) {
    this.domicilioService.put(domicilio.id, domicilio).subscribe(
      () => {
        const indexDom = this.tabla.domicilios.filter(x => x.id === domicilio.id);
        let posicion = this.tabla.domicilios.findIndex(ref => ref.id === indexDom[0].id);
        this.alertsService.successAlert('El domicilio fue actualizado correctamente');
        this.tabla.domicilios.splice(posicion, 1, domicilio);
      },
      () => {
        this.alertsService.errorAlert('Opps... :(', 'Ocurrió un error al actualizar el domicilio');
      }
    );
  }

  onLocalidadChange(value){
    const localidadFiltrada = this.localidades.filter(x => x.nombre === value);
    this.localidadSeleccionada = localidadFiltrada[0].id;
  }

}