import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { ModalRealizarPedidoUsuarioCrearComponent } from '../modal-realizar-pedido-usuario-crear/modal-realizar-pedido-usuario-crear.component';

@Component({
  selector: 'app-modal-realizar-pedido-usuario',
  templateUrl: './modal-realizar-pedido-usuario.component.html',
  styleUrls: ['./modal-realizar-pedido-usuario.component.css']
})
export class ModalRealizarPedidoUsuarioComponent implements OnInit {
  public displayedColumns: string[] = ['nombre', 'apellido', 'dni', 'email', 'telefono'];
  public dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public sidenavOpened: boolean = false;
  public usuarioSeleccionado: Usuario = null;
  public userId: number;


  constructor(public dialog: MatDialog, public service: UsuarioService, public dialogRef: MatDialogRef<ModalRealizarPedidoUsuarioComponent>) { }


  ngOnInit(): void {
    this.getAll();
    this.traducirPaginator();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  traducirPaginator() {
    this.paginator._intl.itemsPerPageLabel = "Registros por Página";
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
    this.service.traerPorRol("cliente").subscribe(response => {
      this.dataSource.data = response;
      console.log(this.dataSource.data);
    },
      error => {
        alert("Error en getAll" + error);
      })
  }


  onSubmit(object: any) {
    this.dialog.open(ModalRealizarPedidoUsuarioCrearComponent, { data: object })
      .afterClosed().subscribe(result => {
        this.crear(result.data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario agregado correctamente!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  onAction() {
    this.dialogRef.close({ data: this.userId });
  }

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }
  
  public crear(element: Usuario) {
    if (element != null && element != undefined) {
      this.service.post(element).subscribe((result) => {
        this.dataSource.data.push(result);
        this.notifyTable();
      });
    }
  }

  public copiarId(id: number): void {
    this.userId = id;
    this.onAction();
  }

  notifyTable() {
    this.dataSource.data = [...this.dataSource.data];
  }
}
