import { ModalUsuarioComponent } from './../modales/modal-usuario/modal-usuario.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../../models/Usuario';
import { DatePipe, getLocaleDateFormat } from '@angular/common';
import { UsuarioService } from '../../../services/allServices/usuario.service'
import Swal from'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  public displayedColumns: string[] = ['nombre', 'apellido', 'dni','email','esCliente','telefono','fechaNacimiento','rol'];
  public dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public sidenavOpened: boolean = false;
  public usuarioSeleccionado : Usuario = null;
  public reformatDate;


  constructor(public dialog: MatDialog, public service: UsuarioService, private datePipe: DatePipe) { }


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
    this.service.getAll().subscribe(response => {
        this.dataSource.data = response;
        console.log(this.dataSource.data);
    },
      error => {
        alert("Error en getAll" + error);
      })
  }


  onSubmit(object: any) {
    this.dialog.open(ModalUsuarioComponent, { data: object })
      .afterClosed().subscribe(result => {
        if (result.event === 'Añadir') {
          this.agregar(result.data);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario agregado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (result.event === 'Editar') {
          this.actualizar(result.data); 
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

  public agregar(element: Usuario) {
    this.service.post(element).subscribe((result) => {
      this.dataSource.data.push(result);
      this.notifyTable();
    });
  }

  public actualizar(element: Usuario) {
    this.service.put(element.id, element).subscribe(() => {
      this.dataSource.data.filter((value) => {
        if (value.id === element.id) {
          const index = this.dataSource.data.indexOf(value);
          this.dataSource.data[index] = element;
        }
      });
      this.notifyTable();
    });
  }

  public refreshData(): void {
    this.service.getAll().subscribe(data => {
      this.dataSource.data = data;
    })
  }

  public eliminar(usuario: Usuario): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo"
    }).then(result => {
      if (result.value) {
        this.service.delete(usuario.id).subscribe(() => {
          Swal.fire('¡Eliminado!', "Tu registo ha sido eliminado.", "success");
          const index = this.dataSource.data.indexOf(usuario);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        },
          error => {
            console.log(error);
            Swal.fire('¡Error!', "Algo salió mal en la operación.", "error");
          })
      }
    })
  }

  notifyTable() {
    this.dataSource.data = [...this.dataSource.data];
  }

  public verDetalles(elemento : Usuario) {
    this.usuarioSeleccionado = elemento;
    this.sidenavOpened = true;
  }

}
