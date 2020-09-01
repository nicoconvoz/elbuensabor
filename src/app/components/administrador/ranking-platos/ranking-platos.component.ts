import { FacturaService } from 'src/app/services/allServices/factura.service';
import { RankingPlatosService } from './../../../services/allServices/rankingPlatos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PlatosPopulares } from '../../../models/PlatosPopulares';

@Component({
  selector: 'app-ranking-platos',
  templateUrl: './ranking-platos.component.html',
  styleUrls: ['./ranking-platos.component.css']
})
export class RankingPlatosComponent implements OnInit {


  public genExcel:boolean=false;
  public displayedColumns: string[] = ['cantidadVendida', 'nombre' ];
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

  PlatosPopulares(fechaDesde:String, fechaHasta:String) {
    console.log(fechaDesde);
    console.log(fechaHasta);
    this.service.platosPopulares(fechaDesde,fechaHasta).subscribe(Plato => {
      console.log(Plato);
      this.genExcel=true;
      let detalles=[];
        detalles=[{
          "id":Plato.id_Plato1,
          "cantidadVendida":Plato.cantidad_Plato1,
          "nombre":Plato.nombre_Plato1,
        },
        {
          "id":Plato.id_Plato2,
          "cantidadVendida":Plato.cantidad_Plato2,
          "nombre":Plato.nombre_Plato2,
        },
        {
          "id":Plato.id_Plato3,
          "cantidadVendida":Plato.cantidad_Plato3,
          "nombre":Plato.nombre_Plato3,
        },
        {
          "id":Plato.id_Plato4,
          "cantidadVendida":Plato.cantidad_Plato4,
          "nombre":Plato.nombre_Plato4,
        },
        {
          "id":Plato.id_Plato5,
          "cantidadVendida":Plato.cantidad_Plato5,
          "nombre":Plato.nombre_Plato5,
        },
        {
          "id":Plato.id_Plato6,
          "cantidadVendida":Plato.cantidad_Plato6,
          "nombre":Plato.nombre_Plato6,
        }];
      
        
        this.dataSource.data = detalles;
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

cargarPlatosPopulares():void{
  this.PlatosPopulares((<HTMLInputElement>document.getElementById("fechaDesde")).value.toString(),(<HTMLInputElement>document.getElementById("fechaHasta")).value.toString());
}
}
