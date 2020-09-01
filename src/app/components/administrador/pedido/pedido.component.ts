import { ModalDetallePedidoComponent } from './../modales/modal-detalle-pedido/modal-detalle-pedido.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Pedido } from '../../../models/Pedido';
import { Detalle } from '../../../models/Detalle';
import { PedidoService } from '../../../services/allServices/pedido.service';
import { DetalleService } from '../../../services/allServices/detalle.service';
import Swal from'sweetalert2';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {


  public displayedColumns: string[] = ['numero', 'detallePedido','fecha', 'envioDelivery', 'domicilio', 'estado'];
  //,'envio','hora','nombreCliente','direccion','telefono','pago','estado'
  public dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  public dataSourceDP: MatTableDataSource<Detalle> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(public dialog: MatDialog, public pedidoService: PedidoService, public detalleService: DetalleService) { }


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
    this.pedidoService.getAll().subscribe(response => {
        this.dataSource.data = response;
    },
      error => {
        alert("Error en getAll" + error);
      })

  }

  

  notifyTable() {
    this.dataSource.data = [...this.dataSource.data];
  }

  public verPedidoDetalle(elemento : Pedido) {
    this.detalleService.buscarPorPedido(elemento.id).subscribe(data => {
      if(data!=null){
        this.dialog.open(ModalDetallePedidoComponent, { width:"800px", data: data });
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



}
