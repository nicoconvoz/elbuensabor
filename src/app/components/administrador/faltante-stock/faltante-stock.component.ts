import { InsumoComponent } from './../insumo/insumo.component';
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
  selector: 'app-faltante-stock',
  templateUrl: './faltante-stock.component.html',
  styleUrls: ['./faltante-stock.component.css']
})
export class FaltanteStockComponent implements OnInit {

  public displayedColumns: string[] = ['nombre', 'stockMinimo', 'stockActual', 'stockMaximo', 'unidadMedida', 'pedido'];
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
      this.todasCategorias();
    },
      error => {
        alert("Error en getAll" + error);
      })
  }

  getInsumoporCategoria(id: number) {
    this.service.getStocks(id).subscribe(response => {
      this.dataSource.data = response;
    },
      error => {
        alert("Error en getAll" + error);
      })
  }

  todasCategorias() {
    this.service.getStocksSinCategoria().subscribe(response => {
      this.dataSource.data = response;
    },
      error => {
        alert("Error en getAll" + error);
      });
  }

  onSubmit(object: Insumo) {
    if(!isNaN(parseFloat((<HTMLInputElement>document.getElementById(object.id.toString())).value.toString()))){
      if(parseFloat((<HTMLInputElement>document.getElementById(object.id.toString())).value.toString())==0){
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Debe incluir un valor mayor que cero!',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
      object.stockActual += parseFloat((<HTMLInputElement>document.getElementById(object.id.toString())).value.toString());
      this.actualizar(object);
      this.id=object.categoria.id;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Pedido realizado correctamente!',
        showConfirmButton: false,
        timer: 1500
      })
    }
    }else{
      (<HTMLInputElement>document.getElementById(object.id.toString())).value="0";
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'El valor ingresado no es valido!',
        showConfirmButton: false,
        timer: 1500
      })
    }
    

  }

  public agregar(element: Insumo) {

    this.service.post(element).subscribe((result) => {
      this.dataSource.data.push(result);
      this.notifyTable();
      
      this.todasCategorias();
    });
  }

  public actualizar(element: Insumo) {
    this.service.put(element.id, element).subscribe(() => {
      this.dataSource.data.filter((value) => {
        if (value.id === element.id) {
          const index = this.dataSource.data.indexOf(value);
          this.dataSource.data[index] = element;
        }
      });
      this.notifyTable();
      
      this.todasCategorias();
    });
  }

  public refreshData(): void {
    this.service.getAll().subscribe(data => {
      this.dataSource.data = data;
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
