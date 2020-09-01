import { Router } from '@angular/router';
import { RolesService } from './../../../services/allServices/roles.service';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexAdminComponent implements OnInit {
  constructor(
    private rolesService: RolesService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  public usuario: Usuario;

  ngOnInit(): void {
    this.isAuth();
    setTimeout(() => this.ver(), 500);
  }

  isAuth(): void {
    this.usuarioService.isAuth().subscribe((resA) => {
      const email = resA.email;
      this.rolesService.getEmail(email).subscribe((resR) => {
        this.usuario = resR;
      });
    });
  }

  public ver(): void {
    if (this.usuario === null) {
      setTimeout(() => this.r(), 500);
    } else if (this.usuario.rol.toLocaleLowerCase() !== 'administrador') {
      setTimeout(() => this.r(), 500);
    }
  }
  public r(): void {
    this.router.navigate(['']);
  }
}
