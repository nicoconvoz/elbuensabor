import { Usuario } from './../../../../models/Usuario';
import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';

@Component({
  selector: 'app-modal-realizar-pedido-usuario-crear',
  templateUrl: './modal-realizar-pedido-usuario-crear.component.html',
  styleUrls: ['./modal-realizar-pedido-usuario-crear.component.css']
})
export class ModalRealizarPedidoUsuarioCrearComponent implements OnInit {

  public dato: boolean;
  public usuario: Usuario;
  public localData: any = { ...this.usuario };
  public action: string;
  public form: FormGroup;
  public cargaCompleta: boolean = false;
  disableSelect = true;

  constructor(public dialogRef: MatDialogRef<ModalRealizarPedidoUsuarioCrearComponent>,
    public formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: boolean, private datePipe: DatePipe,
    private authService: UsuarioService) {
    this.dato = data;
  }

  ngOnInit(): void {
    this.buildForm();
    this.setAction();
    this.form.controls['esCliente'].setValue(true);
    this.form.controls['rol'].setValue("cliente");
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [this.localData.id],
      nombre: [this.localData.nombre, [Validators.required]],
      apellido: [this.localData.apellido, [Validators.required]],
      dni: [this.localData.dni, [Validators.required, , Validators.pattern(/^[0-9]\d*$/)]],
      fechaNacimiento: [this.localData.fechaNacimiento, [Validators.required]],
      telefono: [this.localData.telefono, [Validators.required, , Validators.pattern(/^[0-9]\d*$/)]],
      email: [this.localData.email, [Validators.required, Validators.email]],
      esCliente: [this.localData.esCliente, [Validators.required]],
      rol: [this.localData.Rol],
      password: [this.localData.password]
    });

  }

  public password(): boolean {
    if ((<HTMLInputElement>document.getElementById("P1")).value === (<HTMLInputElement>document.getElementById("P2")).value && (<HTMLInputElement>document.getElementById("P1")).value !== "" && (<HTMLInputElement>document.getElementById("P1")).value !== null) {
      this.form.controls['password'].setValue((<HTMLInputElement>document.getElementById("P2")).value);
      return true;
    }
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Password invalida!',
      showConfirmButton: false,
      timer: 1500
    }).finally(() => {
      (<HTMLInputElement>document.getElementById("P1")).focus();
    });
    (<HTMLInputElement>document.getElementById("P1")).value = "";
    (<HTMLInputElement>document.getElementById("P2")).value = "";
    return false;
  }

  setAction() {
    this.action = 'Crear';
  }

  onAction() {
    let op: boolean = this.password();
    if(this.action=='Crear' && op){
      this.authService.registerUser(this.form.controls['email'].value , this.form.controls['password'].value).then(
        (res)=> {
          this.authService.isAuth().subscribe( user =>{
            this.form.controls['fechaNacimiento'].setValue(this.datePipe.transform(this.form.controls['fechaNacimiento'].value, 'yyyy-MM-dd'));
            this.dialogRef.close({ event: this.action, data: this.form.value });
          });
        });
          
    }else{
    
    if (op) {
      this.form.controls['fechaNacimiento'].setValue(this.datePipe.transform(this.form.controls['fechaNacimiento'].value, 'yyyy-MM-dd'));
      this.dialogRef.close({ event: this.action, data: this.form.value });
    }
  }
}

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  }

}
