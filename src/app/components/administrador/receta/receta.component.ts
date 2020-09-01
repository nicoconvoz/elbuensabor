import { ModalPlatoComponent } from './../modales/modal-plato/modal-plato.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Plato } from '../../../models/Plato';
import { PlatoService } from '../../../services/allServices/plato.service'
import Swal from'sweetalert2';
import { DetallePlato } from 'src/app/models/DetallePlato';

@Component({
  selector: 'app-receta',
  templateUrl: './receta.component.html',
  styleUrls: ['./receta.component.css']
})
export class RecetaComponent implements OnInit {

  public displayedColumns: string[] = ['nombre','categoria','ingredientes','precioCosto','precioVenta' ];
  public dataSource: MatTableDataSource<Plato> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public sidenavOpened: boolean = false;
  public platoSeleccionado : Plato = null;


  constructor(public dialog: MatDialog, public service: PlatoService) { }


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


  onSubmit(object: Plato) {
    this.dialog.open(ModalPlatoComponent, { width:'600px', data: object })
      .afterClosed().subscribe(result => {
        if (result.event === 'Añadir') {
          this.actualizar(result.data, true);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Plato agregado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (result.event === 'Editar') {
          this.actualizar(result.data, false); 
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Plato actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }



  public actualizar(element: Plato, op:boolean) {
    this.service.put(element.id, element).subscribe((data) => {
      console.log(data.detalle);
      if(op){
        this.dataSource.data.push(data);
        this.notifyTable();
      }else{
        
      this.dataSource.data.filter((value) => {
        if (value.id === element.id) {
          const index = this.dataSource.data.indexOf(value);
          this.dataSource.data[index] = element;
        }
      });
      }
      this.notifyTable();
      this.getAll();
    });
  }

  public refreshData(): void {
    this.service.getAll().subscribe(data => {
      this.dataSource.data = data;
    })
  }

  public eliminar(plato: Plato): void {
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
        this.service.delete(plato.id).subscribe(() => {
          Swal.fire('¡Eliminado!', "Tu registo ha sido eliminado.", "success");
          const index = this.dataSource.data.indexOf(plato);
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

  public verDetalles(elemento : Plato) {
    this.platoSeleccionado = elemento;
    this.sidenavOpened = true;
  }

}
