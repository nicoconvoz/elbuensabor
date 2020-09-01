import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/services/allServices/roles.service';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexCajeroComponent implements OnInit {

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
    } else if (this.usuario.rol.toLocaleLowerCase() !== 'administrador' && this.usuario.rol.toLocaleLowerCase() !== 'cajero' ) {
      setTimeout(() => this.r(), 500);
    }
  }
  public r(): void {
    this.router.navigate(['']);
  }
}
