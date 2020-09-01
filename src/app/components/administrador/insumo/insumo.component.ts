import { Insumo } from './../../../models/Insumo';
import { ModalInsumoComponent } from './../modales/modal-insumo/modal-insumo.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaInsumoService } from '../../../services/allServices/categoriaInsumo.service'
import Swal from 'sweetalert2';
import { InsumoService } from 'src/app/services/allServices/insumo.service';
@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.css']
})
export class InsumoComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precioCosto', 'precioVenta', 'stockMinimo', 'stockActual', 'stockMaximo', 'categoria', 'unidadMedida'];
  public dataSource: MatTableDataSource<Insumo> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public sidenavOpened: boolean = false;
  public insumoSeleccionado: Insumo = null;
  public categorias: any;
  public id: number = 0;


  constructor(public dialog: MatDialog, public service: InsumoService, public service2: CategoriaInsumoService) { }


  ngOnInit(): void {
    this.getCategoria()
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
  async getCategoria() {
    await this.service2.getAll().subscribe(response => {
      this.categorias = response;
      console.log(response[0].id);
      this.getInsumoporCategoria(response[0].id);
    },
      error => {
        alert("Error en getAll" + error);
      })
  }

  getInsumoporCategoria(id: number) {
    this.service.buscarporCategoria(id).subscribe(response => {
      this.dataSource.data = response;
      console.log(this.dataSource.data);
    },
      error => {
        alert("Error en getAll" + error);
      })
  }

  todasCategorias() {
    this.service.getAll().subscribe(response => {
      this.dataSource.data = response;
    },
      error => {
        alert("Error en getAll" + error);
      });
  }

  onSubmit(object: Insumo) {
    this.dialog.open(ModalInsumoComponent, { width: '600px', data: object })
      .afterClosed().subscribe(result => {
        if (result.event === 'Añadir') {
          this.agregar(result.data.object);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Insumo agregado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (result.event === 'Editar') {
          this.actualizar(result.data.object);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Insumo actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

  public agregar(element: Insumo) {

    this.service.post(element).subscribe((result) => {
      this.dataSource.data.push(result);
      this.notifyTable();
      this.getInsumoporCategoria(this.id);
    });
  }

  public actualizar(element: Insumo) {
    console.log(element);
    this.service.put(element.id, element).subscribe(() => {
      this.dataSource.data.filter((value) => {
        if (value.id === element.id) {
          const index = this.dataSource.data.indexOf(value);
          this.dataSource.data[index] = element;
        }
      });
      this.notifyTable();
      this.getInsumoporCategoria(this.id);
      //this.getInsumoporCategoria(this.id);
    });
  }

  public refreshData(): void {
    this.service.getAll().subscribe(data => {
      this.dataSource.data = data;
    })
  }

  public eliminar(insumo: Insumo): void {
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
        this.service.delete(insumo.id).subscribe(() => {
          Swal.fire('¡Eliminado!', "Tu registo ha sido eliminado.", "success");
          const index = this.dataSource.data.indexOf(insumo);
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

  public verDetalles(elemento: Insumo) {
    this.insumoSeleccionado = elemento;
    this.sidenavOpened = true;
  }

  cargarCategoria(id: number): void {
    this.getInsumoporCategoria(id);
    this.id = id;
  }

}
