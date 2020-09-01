import { DetalleService } from 'src/app/services/allServices/detalle.service';
import { Pedido } from 'src/app/models/Pedido';
import { UsuarioService } from 'src/app/services/allServices/usuario.service';
import { PedidosUsuariosComponent } from './../modales/pedidos-usuarios/pedidos-usuarios.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PedidoService } from 'src/app/services/allServices/pedido.service';
import Swal from 'sweetalert2';
import { ModalDetallePedidoComponent } from '../modales/modal-detalle-pedido/modal-detalle-pedido.component';

@Component({
  selector: 'app-pedidos-agrupados-por-cliente',
  templateUrl: './pedidos-agrupados-por-cliente.component.html',
  styleUrls: ['./pedidos-agrupados-por-cliente.component.css']
})
export class PedidosAgrupadosPorClienteComponent implements OnInit {

  public genExcel: boolean = false;
  public cargarUsuario: number;
  public usuario: String;
  public displayedColumns: string[] = ['usuario', 'detallePedido', 'fecha', 'envioDelivery', 'domicilio', 'estado'];
  public dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(public dialog: MatDialog, public service: PedidoService, public service2: UsuarioService, public detalleService:DetalleService) { }


  ngOnInit(): void {
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

  PedidosPorUsuarios(fechaDesde: String, fechaHasta: String) {
    this.service2.getOne(this.cargarUsuario).subscribe(data => {
      this.usuario = data.nombre + ' ' + data.apellido;
      this.service.getPedidosPorUsuario(this.cargarUsuario, fechaDesde, fechaHasta).subscribe(Pedido => {
        this.genExcel = true;
        this.dataSource.data = Pedido;
        console.log("PEDIDO: ");
        console.log( Pedido);
        console.log("PEDIDO: ");
        this.notifyTable();
      },
        error => {
          alert("Error en getAll" + error);
        })
    })

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

  onSubmitUsuario(): void {
    this.dialog.open(PedidosUsuariosComponent, { width: "1000px" })
      .afterClosed().subscribe(result => {
        this.cargarUsuario=result.data;
        console.log("cargarUsuario" + this.cargarUsuario);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario seleccionado correctamente!',
          showConfirmButton: false,
          timer: 1500
        }).finally(()=>{
          this.cargarPedidosPorUsuario();
        });

      });
  }
  notifyTable() {
    this.dataSource.data = [...this.dataSource.data];
  }

  cargarPedidosPorUsuario(): void {
    this.PedidosPorUsuarios((<HTMLInputElement>document.getElementById("fechaDesde")).value.toString(), (<HTMLInputElement>document.getElementById("fechaHasta")).value.toString());
  }

}
