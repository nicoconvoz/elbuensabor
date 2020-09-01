import { Localidad } from './../../../../models/Localidad';
import { LocalidadService } from './../../../../services/allServices/localidad.service';
import { Domicilio } from './../../../../models/Domicilio';
import { Usuario } from './../../../../models/Usuario';
import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-realizar-pedido-domicilio-crear',
  templateUrl: './modal-realizar-pedido-domicilio-crear.component.html',
  styleUrls: ['./modal-realizar-pedido-domicilio-crear.component.css']
})
export class ModalRealizarPedidoDomicilioCrearComponent implements OnInit {

  public dato: number;
  public domicilio: Domicilio;
  public localData: any = { ...this.domicilio };
  public localDataLocalidad: any;
  public action: string;
  public form2: FormGroup;
  public cargaCompleta: boolean = false;
  public disableSelect = true;
  public usuarioSelec: any;
  public usuario: Usuario = {} as any;
  public localidadSelec: any;
  public localidad: Localidad = {} as any;
  public opcionesLocalidad: any;

  constructor(public dialogRef: MatDialogRef<ModalRealizarPedidoDomicilioCrearComponent>,
    public formBuilder2: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: number, public service: LocalidadService) {
    this.dato = data;
  }

  ngOnInit(): void {
    this.getAll();
    this.buildForm2();
    this.setAction();
    this.usuario.id = this.dato;
    this.usuarioSelec = { ...this.usuario };
    this.form2.controls['propietario'].setValue(this.usuario);
  }

  getAll() {
    this.service.getAll().subscribe(response => {
      this.localDataLocalidad = response;
    },
      error => {
        alert("Error en getAll" + error);
      })
  }

  buildForm2() {
    this.form2 = this.formBuilder2.group({
      id: [this.localData.id],
      calle: [this.localData.calle, [Validators.required]],
      departamento: [this.localData.departamento, [Validators.required]],
      numero: [this.localData.numero, [Validators.required, , Validators.pattern(/^[0-9]\d*$/)]],
      piso: [this.localData.piso, [Validators.required]],
      propietario: [this.localData.propietario],
      localidad: [this.localData.localidad],
      opcionesLocalidad: [this.opcionesLocalidad]
    });

  }

  setAction() {
    this.action = 'Crear';
  }

  onAction() {
    this.dialogRef.close({ event: this.action, data: this.form2.value });
  }

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  public errorHandling = (control: string, error: string) => {
    return this.form2.controls[control].hasError(error);
  }

  cargarLocalidad(id: number): void {
    this.localidad.id = id;
    this.localidadSelec = { ...this.localidad };
    this.form2.controls['localidad'].setValue(this.localidad);
  }
}
