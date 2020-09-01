import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import Swal from'sweetalert2';
import { Usuario } from 'src/app/models/Usuario';
import { DomicilioService } from 'src/app/services/allServices/domicilio.service';
import { ModalRealizarPedidoDomicilioCrearComponent } from '../modal-realizar-pedido-domicilio-crear/modal-realizar-pedido-domicilio-crear.component';
import { Domicilio } from 'src/app/models/Domicilio';


@Component({
  selector: 'app-modal-realizar-pedido-domicilio',
  templateUrl: './modal-realizar-pedido-domicilio.component.html',
  styleUrls: ['./modal-realizar-pedido-domicilio.component.css']
})
export class ModalRealizarPedidoDomicilioComponent implements OnInit {

  public displayedColumns: string[] = ['direccion'];
  public dataSource: MatTableDataSource<Domicilio> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public usuarioSeleccionado : Usuario = null;
  public userId:number;
  public domId:number;


  constructor(public dialog: MatDialog, public service: DomicilioService, public dialogRef: MatDialogRef<ModalRealizarPedidoDomicilioComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data: number) {
      this.userId=data;
   }


  ngOnInit(): void {
    this.getAll();
    this.traducirPaginator();
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
  }

  traducirPaginator(){
    this.paginator._intl.itemsPerPageLabel ="Registros por Página";
    this.paginator._intl.nextPageLabel = "Siguiente"
    this.paginator._intl.previousPageLabel = "Anterior";
    this.paginator._intl.firstPageLabel = "Primera Página";
    this.paginator._intl.lastPageLabel = "Última Página";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll() {
    this.service.buscarporUsuario(this.userId).subscribe(response => {
        this.dataSource.data = response;
    },
      error => {
        alert("Error en getAll" + error);
      })
  }


   onSubmit() {
    this.dialog.open(ModalRealizarPedidoDomicilioCrearComponent, { data: this.userId })
      .afterClosed().subscribe(result => {
          this.crear(result.data);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Domicilio agregado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
      });
  } 

  onAction() {
    this.dialogRef.close({  data: this.domId });
}

onCancel() {
  this.dialogRef.close({ event: 'Cancel' });
}
  public crear(element: Domicilio) {
    if(element!=null && element!=undefined){
    this.service.post(element).subscribe((result) => {
      this.dataSource.data.push(result);
      this.notifyTable();
    });
  }
  }

  public copiarId(id:number):void{
    this.domId=id;
    this.onAction();
  }

  notifyTable() {
    this.dataSource.data = [...this.dataSource.data];
  }
}
