import { FacturaService } from 'src/app/services/allServices/factura.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-recaudaciones',
  templateUrl: './recaudaciones.component.html',
  styleUrls: ['./recaudaciones.component.css']
})
export class RecaudacionesComponent implements OnInit {

  public genExcel:boolean=false;
  public displayedColumns: string[] = ['montoNeto', 'gastos', 'ganancias' ];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  constructor(public dialog: MatDialog, public service: FacturaService) { }


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

  recaudaciones(fechaDesde:String, fechaHasta:String) {
    console.log(fechaDesde);
    console.log(fechaHasta);
    this.service.recaudaciones(fechaDesde,fechaHasta).subscribe(data => {
      console.log(data);
      this.genExcel=true;
      let recaudaciones=[];
        recaudaciones=[{
          "fechaDesde":data.fechaDesde,
          "fechaHasta":data.fechaHasta,
          "montoNeto":data.montoNeto,
          "gastos":data.gastos,
          "ganancias":data.ganancias,
          "eliminado":data.eliminado,
        }];
      
        
        this.dataSource.data = recaudaciones;
        console.log(this.dataSource.data);
        this.notifyTable();
    },
      error => {
        alert("Error en getAll" + error);
      })
  }

  notifyTable() {
    this.dataSource.data = [...this.dataSource.data];
  }

cargarRecaudaciones():void{
  this.recaudaciones((<HTMLInputElement>document.getElementById("fechaDesde")).value.toString(),(<HTMLInputElement>document.getElementById("fechaHasta")).value.toString());
}

}
