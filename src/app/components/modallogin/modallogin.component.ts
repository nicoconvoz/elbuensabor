import { Component, OnInit, ViewChild, ElementRef, Host, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/allServices/usuario.service';
import { RolesService } from '../../services/allServices/roles.service';
import {NgForm} from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modallogin',
  templateUrl: './modallogin.component.html',
  styleUrls: ['./modallogin.component.css']
})
export class ModalloginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private router:Router, private authService: UsuarioService, private servicio: RolesService, private formBuilder: FormBuilder) { }
  
  public formLogin: FormGroup;
  public email: string = '';
  public password: string = '';
  errormsg = '';
  usuarioLogeado: Usuario = {};
  nuevoUsuario : Usuario = {};

  @ViewChild('btnClose', { static: true }) btnClose: ElementRef;
  @Output() rol = new EventEmitter<string>();

  ngOnInit(): void {
    this.onBuild();
  }

  onLoginRedirect():void{
    this.router.navigate(['catalogo']);
  }

  onBuild() {
    this.formLogin = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  onLogin(formLogin : FormGroup):void{
    this.authService.loginEmailUser(formLogin.value.email, formLogin.value.password)
    .then((res)=>{
      //this.onLoginRedirect(); 
      this.btnClose.nativeElement.click();
      //comenzamos a estblecer el rol, buscando al usuario
      this.servicio.getEmail(formLogin.value.email).subscribe( res =>{
        this.usuarioLogeado = res;
       this.rol.emit(this.usuarioLogeado.rol); //esta linea emite el Rol de usuario 
       window.location.reload();
      }, err => {
        alert('Ocurrió un gran error');
      });
      this.errormsg = '';
    }).catch( err => {
     this.errormsg =  err.message; 
    });
  }

  onLoginGoogle() : void {
    this.authService.loginGoogleUser()
    .then((res)=>{
      this.authService.isAuth().subscribe(res=>{
        const correo = res.email;
        this.servicio.getEmail(correo).subscribe( res=>{
          this.rol.emit(res.rol);
          window.location.reload();
        }, err=>{
          this.nuevoUsuario.email = correo;
            const displayName = res.displayName;
            const dnArray = displayName.split(" ");
            const first = dnArray[0];
            const last = dnArray[1];
            this.nuevoUsuario.nombre = first;
            this.nuevoUsuario.apellido = last;
            this.nuevoUsuario.rol = 'cliente';
            this.nuevoUsuario.esCliente = true;
            // this.nuevoUsuario.telefono = Number.parseInt(res.phoneNumber);
           //post user
            this.servicio.post(this.nuevoUsuario).subscribe(res =>{
            this.rol.emit(this.usuarioLogeado.rol);
            window.location.reload();
            }, 
            err=>{
              this.errormsg =  err.message;
            });
        });
      });
      this.btnClose.nativeElement.click();
    }).catch(err => {
      this.errormsg =  err.message;
    });
    
   this.nuevoUsuario = {};
  }

  
}
