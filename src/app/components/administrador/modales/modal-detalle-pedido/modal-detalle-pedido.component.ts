import { Detalle } from './../../../../models/Detalle';
import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DetalleService } from '../../../../services/allServices/detalle.service';
import Swal from'sweetalert2';

@Component({
  selector: 'app-modal-detalle-pedido',
  templateUrl: './modal-detalle-pedido.component.html',
  styleUrls: ['./modal-detalle-pedido.component.css']
})
export class ModalDetallePedidoComponent implements OnInit {

 
  public displayedColumns: string[] = ['id', 'cantidad','producto','precioVenta', 'tiempoPreparacion'];
  //,'envio','hora','nombreCliente','direccion','telefono','pago','estado'
  public dataSource: MatTableDataSource<Detalle> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(public dialogRef: MatDialogRef<ModalDetallePedidoComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public detalleService: DetalleService) {
    this.dataSource.data = [ ...data ];
    console.log(this.dataSource.data);
   }

  ngOnInit(): void {
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


  /*onSubmit(object: any) {
    this.dialog.open(ModalPedidoComponent, { data: object })
      .afterClosed().subscribe(result => {
        if (result.event === 'Añadir') {
          this.agregar(result.data);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Pedido agregado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (result.event === 'Editar') {
          this.actualizar(result.data); 
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Pedido actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

  public agregar(element: Pedido) {
    this.pedidoService.post(element).subscribe((result) => {
      this.dataSource.data.push(result);
      this.notifyTable();
    });
  }

  public actualizar(element: Pedido) {
    this.pedidoService.put(element.id, element).subscribe(() => {
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
    this.pedidoService.getAll().subscribe(data => {
      this.dataSource.data = data;
    })
  }
*/
/*
  public eliminar(pedido: Pedido): void {
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
        this.pedidoService.delete(pedido.id).subscribe(() => {
          Swal.fire('¡Eliminado!', "Tu registo ha sido eliminado.", "success");
          const index = this.dataSource.data.indexOf(pedido);
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

  public verPedidoDetalle(elemento : Pedido) {
    this.detalleService.buscarPorPedido(elemento.id).subscribe(data => {
      if(data!=null){
        this.dialog.open(ModalPedidoComponent, { data: data });
      }else{
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'No existe información disponible!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    },error => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al obtener la información!',
        showConfirmButton: false,
        timer: 1500
      })
    })
    
  }

  public calcularMonto(id:number):number{
    return id+10;
  }
*/

}
