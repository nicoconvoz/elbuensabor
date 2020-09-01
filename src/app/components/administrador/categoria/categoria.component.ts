import { ModalCategoriaComponent } from './../modales/modal-categoria/modal-categoria.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Categoria } from '../../../models/Categoria';
import { CategoriaService } from '../../../services/allServices/categoria.service'
import Swal from'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  public displayedColumns: string[] = ['id','nombre', 'descripcion'];
  public dataSource: MatTableDataSource<Categoria> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public sidenavOpened: boolean = false;
  public categoriaSeleccionada : Categoria = null;


  constructor(public dialog: MatDialog, public service: CategoriaService) { }


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
    },
      error => {
        alert("Error en getAll" + error);
      })
  }


  onSubmit(object: any) {
    this.dialog.open(ModalCategoriaComponent, {  width:"600px",data: object })
      .afterClosed().subscribe(result => {
        if (result.event === 'Añadir') {
          this.agregar(result.data);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Categoria agregada correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (result.event === 'Editar') {
          this.actualizar(result.data); 
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Categoria actualizada correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

  public agregar(element: Categoria) {
    this.service.post(element).subscribe((result) => {
      this.dataSource.data.push(result);
      this.notifyTable();
    });
  }

  public actualizar(element: Categoria) {
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

  public eliminar(categoria: Categoria): void {
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
        this.service.delete(categoria.id).subscribe(() => {
          Swal.fire('¡Eliminado!', "Tu registo ha sido eliminado.", "success");
          const index = this.dataSource.data.indexOf(categoria);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        },
          error => {
            Swal.fire('¡Error!', "Algo salió mal en la operación.", "error");
          })
      }
    })
  }

  notifyTable() {
    this.dataSource.data = [...this.dataSource.data];
  }

  public verDetalles(elemento : Categoria) {
    this.categoriaSeleccionada = elemento;
    this.sidenavOpened = true;
  }

}
