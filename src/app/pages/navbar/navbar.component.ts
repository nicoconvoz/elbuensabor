import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../services/allServices/usuario.service';
import { RolesService } from '../../services/allServices/roles.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //constructor
  constructor(private servicio: UsuarioService,
    private roles: RolesService,
    private router: Router) { }

  //atributos y variables
  public isLogged: boolean = false;
  @Input() rol = ' ';

  ngOnInit(): void {
    this.isLoggedMethod();
    if (this.rol == ' ') {
      this.consultarRol();
    }
  }

  consultarRol() {
    this.servicio.isAuth().subscribe(user => {
      if (user != null) {
        this.isLogged = true;
        if (this.rol == ' ') {
          this.roles.getEmail(user.email).subscribe(
            res => {
              this.rol = res.rol;
            },
            err => {
            }
          );
        }
      } else {
        this.rol = ' ';
      }
    });
  }

  isLoggedMethod() {
    this.servicio.isAuth().subscribe(user => {
      if (user != null) {
        this.isLogged = true;
      } else {
        this.rol = ' ';
      }
    });
  }

  onLogout() {
    this.servicio.logoutUser();
    this.isLogged = false;
    this.router.navigate(['/']);
    this.rol = ' ';
  }

  inputlistener(parameter: any) {
    this.rol = parameter;
  }

  esquere() {
  }

  isAuth() {
    this.servicio.isAuth().subscribe(res => {
    });
  }
}
