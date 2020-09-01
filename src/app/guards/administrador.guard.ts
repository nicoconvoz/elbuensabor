import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/allServices/usuario.service';
import { RolesService } from '../services/allServices/roles.service';

@Injectable({
  providedIn: 'root',
})
export class AdministradorGuard implements CanActivate {
  acceso: boolean;

  constructor(
    private servfire: UsuarioService,
    private servroles: RolesService,
    private router: Router
  ) {
    this.servfire.isAuth().subscribe(
      (res) => {
        this.servroles.getEmail(res.email).subscribe(
          (res) => {
            if (res.rol == 'administrador' || res.rol == 'Administrador') {
              this.acceso = true;
            }
          },
          (err) => {
            this.acceso = false;
          }
        );
      },
      (err) => {
        this.acceso = false;
      }
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('segunda ejecucion del Guard', this.acceso);
    return this.acceso;
  }
}
