import { Usuario } from './../../../../models/Usuario';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { preserveWhitespacesDefault } from '@angular/compiler';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  public localData: any;
  public action: string;
  public form: FormGroup;
  disableSelect = true;
  rolGuardado: String;
  opciones: String;

  constructor(public dialogRef: MatDialogRef<ModalUsuarioComponent>,
    public formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Usuario, private datePipe: DatePipe) {
    this.localData = { ...data };
  }

  ngOnInit(): void {
    this.buildForm();
    this.setAction();
    this.cargarAjustes();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [this.localData.id],
      password: [this.localData.password],
      nombre: [this.localData.nombre, [Validators.required]],
      apellido: [this.localData.apellido, [Validators.required]],
      dni: [this.localData.dni, [Validators.required, , Validators.pattern(/^[0-9]\d*$/)]],
      fechaNacimiento: [this.localData.fechaNacimiento, [Validators.required]],
      telefono: [this.localData.telefono, [Validators.required, , Validators.pattern(/^[0-9]\d*$/)]],
      email: [this.localData.email, [Validators.required, Validators.email]],
      esCliente: [this.localData.esCliente, [Validators.required]],
      rol: [this.localData.rol],
      esClienteOpciones: [this.opciones]
    });

  }

  setAction() {
    this.action = (this.localData.id) ? 'Editar' : 'Añadir';
  }

  onAction() {
    let op: boolean = this.password();
    if (op) {
      this.form.controls['fechaNacimiento'].setValue(this.datePipe.transform(this.form.controls['fechaNacimiento'].value, 'yyyy-MM-dd'));
      this.dialogRef.close({ event: this.action, data: this.form.value });
    }
  }

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  }

  cargarAjustes() {
    if (this.form.controls['rol'].value != null) {
      this.rolGuardado = this.form.controls['rol'].value;
      this.form.controls['esCliente'].setValue(false);
      this.form.controls['esClienteOpciones'].setValue("false");
    } else {
      this.form.controls['esClienteOpciones'].setValue("true");
      this.form.controls['esCliente'].setValue(true);
      this.form.controls['rol'].setValue("cliente");
    }
  }

  public password(): boolean {
    if ((<HTMLInputElement>document.getElementById("P1")).value === this.localData.password && (<HTMLInputElement>document.getElementById("P2")).value === (<HTMLInputElement>document.getElementById("P3")).value && (<HTMLInputElement>document.getElementById("P2")).value != "" && (<HTMLInputElement>document.getElementById("P2")).value != null) {
      this.form.controls['password'].setValue((<HTMLInputElement>document.getElementById("P2")).value);
      return true;
    } else {
      if ((<HTMLInputElement>document.getElementById("P1")).value === "" || (<HTMLInputElement>document.getElementById("P1")).value === null) {
        return true;
      }
    }
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Password invalida!',
      showConfirmButton: false,
      timer: 1500
    });
    (<HTMLInputElement>document.getElementById("P1")).value = "";
    (<HTMLInputElement>document.getElementById("P2")).value = "";
    (<HTMLInputElement>document.getElementById("P3")).value = "";
    (<HTMLInputElement>document.getElementById("P1")).focus();
    return false;
  }

  dS(o: boolean) {
    this.disableSelect = o;
    if (o) {
      this.form.controls['esCliente'].setValue(true);
      this.form.controls['esClienteOpciones'].setValue("true");
      this.form.controls['rol'].setValue("Cliente");
    } else {
      this.form.controls['rol'].setValue(this.rolGuardado);
      this.form.controls['esClienteOpciones'].setValue("false");
      this.form.controls['esCliente'].setValue(false);
    }
  }

}
