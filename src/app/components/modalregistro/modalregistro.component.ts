import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/allServices/usuario.service';
import { RolesService } from '../../services/allServices/roles.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Usuario } from 'src/app/models/Usuario';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-modalregistro',
  templateUrl: './modalregistro.component.html',
  styleUrls: ['./modalregistro.component.css']
})
export class ModalregistroComponent implements OnInit {

  constructor( private router: Router, private authService: UsuarioService, private serviciorol : RolesService,private storage: AngularFireStorage, private formBuilder: FormBuilder) { }

  @ViewChild('btnClose', { static: true }) btnClose: ElementRef;
  @ViewChild('imageUser',{static:true}) inputImageUser: ElementRef;
  //variables
  public formRegistro: FormGroup;
  public email: string = '';
  public password: string = '';
  public nombre:string = '';
  public apellido:string = '';
  public telefono:number = null;
  public fechaNacimiento:Date = null;
  errormsg = '';

  nuevoUsuario : Usuario = {};

  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  ngOnInit(): void {
    this.onBuild();
  }

  onBuild() {
    this.formRegistro = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required,  Validators.pattern(/^[0-9]\d*$/)]),
      fechaNacimiento: new FormControl('', [Validators.required])
    });
  }

  onUpload(e){
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/profile_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath,file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize (()=> this.urlImage = ref.getDownloadURL())).subscribe();

  }

  onAddUser(formRegistro : FormGroup){
   this.authService.registerUser(formRegistro.value.email , formRegistro.value.password).then(
      (res)=> {
        this.authService.isAuth().subscribe( user =>{
          
        });
        //codigo para agregar nuevo usuario
        this.nuevoUsuario.nombre = formRegistro.value.nombre;
        this.nuevoUsuario.rol = 'cliente';
        this.nuevoUsuario.apellido = formRegistro.value.apellido;
        this.nuevoUsuario.email = formRegistro.value.email;
        this.nuevoUsuario.esCliente = true;
        this.nuevoUsuario.fechaNacimiento = formRegistro.value.fechaNacimiento;
        this.nuevoUsuario.password = formRegistro.value.password;
        this.nuevoUsuario.telefono = formRegistro.value.telefono;
        
        this.serviciorol.post(this.nuevoUsuario).subscribe(
          res => { window.location.reload();},
          err => {}
        );
        //end
        this.btnClose.nativeElement.click();
      
        this.errormsg = '';
      }
      
    ).catch ( (error) => {
      this.errormsg = error.message;
      });
    this.nuevoUsuario = {};
  }

   onLoginGoogle() : void {
    this.authService.loginGoogleUser()
    .then((res)=>{
      this.authService.isAuth().subscribe(res=>{
        const correo = res.email;
        this.serviciorol.getEmail(correo).subscribe( res=>{
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
            this.nuevoUsuario.fechaNacimiento =  this.fechaNacimiento;
            this.nuevoUsuario.telefono = this.telefono;
           //post user
            this.serviciorol.post(this.nuevoUsuario).subscribe(res =>{
              window.location.reload();
            }, 
            err=>{
            });
        });
      });
      this.btnClose.nativeElement.click();
    }).catch ( (error) => {
      this.errormsg = error.message;
      });
    
   this.nuevoUsuario = {};
  }

  onLoginRedirect(){
    this.router.navigate(['catalogo']);
  }

}
