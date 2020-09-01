import { Component, OnInit, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { Plato } from '../../models/plato';
import { PlatoService } from '../../services/allServices/plato.service';
import { UsuarioService } from '../../services/allServices/usuario.service';
import { RolesService } from '../../services/allServices/roles.service';
//Importaciones para utilizar Firebase
import { AngularFireStorage } from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private servicio : PlatoService, private servfire : UsuarioService,
              private servroles: RolesService) { }
  
  platos : Plato [] = [];

  ngOnInit(): void {
    this.traerPlatos();
  }

  traerPlatos(){
    this.servicio.getOne(1).subscribe(
      res => {
        this.platos.push(res);
      }, err =>{
      }
    );
    this.servicio.getOne(3).subscribe(res => {
      this.platos.push(res);
    }, err =>{
    });
    this.servicio.getOne(2).subscribe(res => {
      this.platos.push(res);
    }, err =>{
    });
    this.servicio.getOne(4).subscribe(res => {
      this.platos.push(res);
    }, err =>{
    });
    this.servicio.getOne(5).subscribe(res => {
      this.platos.push(res);
    }, err =>{
    });
    this.servicio.getOne(6).subscribe(res => {
      this.platos.push(res);
    }, err =>{
    });
  }

}
