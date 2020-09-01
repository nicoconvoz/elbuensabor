import { Injectable, Input } from '@angular/core';
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
import { async } from 'rxjs/internal/scheduler/async';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClienteGuard implements CanActivate {
  constructor(
    private servfire: UsuarioService,
    public servroles: RolesService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
