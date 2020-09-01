import { DetallePlato } from './../../../../models/DetallePlato';
import { ModalIngredienteComponent } from './../modal-ingrediente/modal-ingrediente.component';
import { Detalle } from './../../../../models/Detalle';
import { PlatoService } from './../../../../services/allServices/plato.service';
import { Plato } from './../../../../models/Plato';
import { CategoriaService } from './../../../../services/allServices/categoria.service';
import { Component, OnInit, ViewChild, Inject, Optional, ElementRef   } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from'sweetalert2';
import { DetallePlatoService } from 'src/app/services/allServices/detalleplato.service';
//imagenes
import { AngularFireStorage } from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-modal-plato',
  templateUrl: './modal-plato.component.html',
  styleUrls: ['./modal-plato.component.css']
})
export class ModalPlatoComponent implements OnInit {


  public displayedColumns: string[] = ['ingrediente','cantidad','unidadMedida'];
  //,'envio','hora','nombreCliente','direccion','telefono','pago','estado'
  public dataSource: MatTableDataSource<DetallePlato> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  //variables para subida de imagenes
  uploadPercent : Observable<number>;
  urlImage : Observable<string>;
  urlString : string;
  bandera : boolean = false;
  activarSalida:boolean=false;
  @ViewChild('imagenPlato')  imagenPlato : ElementRef;

  public localData: any;
  public localDataDetallePlato:any;
  public localDataCategoria: any;
  public action: string;
  public form: FormGroup;
  public dataDetalle:any;
  disableSelect = true;
  rolGuardado:String;
  opciones:String;

  constructor(public dialogRef: MatDialogRef<ModalPlatoComponent>,public dialog: MatDialog,
    public formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private datePipe: DatePipe,
    private service: CategoriaService, private service2:DetallePlatoService, private service3:PlatoService, private storage : AngularFireStorage) {
    if(data.detalle!=undefined){
      this.dataSource.data = [ ...data.detalle];
    }
    this.dataDetalle=data.detalle;
    console.log("DATOS:" + this.dataSource.data);
    this.localData = { ...data };
  }

  ngOnInit(): void {
    this.getAll();
    this.buildForm();
    this.setAction();
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

  public crearPlato() {
    let formcontenido=this.form.value;
    this.form.controls['cantidadVendida'].setValue(0);
    this.service3.post(this.form.value).subscribe((result) => {
      this.service3.getOne(result.id).subscribe((resultado) => {
      let plato:any=resultado;
      this.dataDetalle = plato.detalle;
      this.dataSource.data = [ ...plato.detalle];
      this.localData = { ...plato };
      this.getAll();
      this.form.controls['id'].setValue(result.id);
      });
    });
  }


  onSubmit(object: DetallePlato) {
    console.log("ID localdata: "+ this.localData.id + " " + this.localData.nombre)
    this.dialog.open(ModalIngredienteComponent, { data: {object:object,plato:this.localData}})
      .afterClosed().subscribe(result => {
        if (result.event === 'Añadir') {
          this.agregar(result.data.object);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Ingrediente agregado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (result.event === 'Editar') {
          this.actualizar(result.data.object); 
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Ingrediente actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

  public agregar(element: DetallePlato) {
    console.log("Element");
    console.log(element);
    this.service2.post(element).subscribe((result) => {
      this.form.controls['detalle'].setValue(element);
      if(result.unidadMedida.abreviatura=="g"){
        result.unidadMedida.abreviatura="kg";
      }else if(result.unidadMedida.abreviatura=="kg"){
        result.unidadMedida.abreviatura="g";
      }else if(result.unidadMedida.abreviatura=="l"){
        result.unidadMedida.abreviatura="ml";
      }else if(result.unidadMedida.abreviatura=="ml"){
        result.unidadMedida.abreviatura="l";
      }
      this.dataSource.data.push(result);
      this.notifyTable();

    });
  }

  public actualizar(element: DetallePlato) {
    this.service2.put(element.id, element).subscribe((result) => {
      if(result.unidadMedida.abreviatura=="g"){
      result.unidadMedida.abreviatura="kg";
      }else if(result.unidadMedida.abreviatura=="kg"){
        result.unidadMedida.abreviatura="g";
      }else if(result.unidadMedida.abreviatura=="l"){
        result.unidadMedida.abreviatura="ml";
      }else if(result.unidadMedida.abreviatura=="ml"){
        result.unidadMedida.abreviatura="l";
      }
      this.dataSource.data.filter((value) => {
        if (value.id === element.id) {
          const index = this.dataSource.data.indexOf(value);
          this.dataSource.data[index] = element;
        }
      });
      this.notifyTable();
    });
  }

  public eliminar(plato: DetallePlato): void {
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
        this.service2.delete(plato.id).subscribe(() => {
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


  getAll():void{
    this.service.getAll().subscribe(data => {
      this.localDataCategoria = data;
    })
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [this.localData.id],
      nombre: [this.localData.nombre, [Validators.required]],
      categoria: [this.localData.categoria, [Validators.required]],
      precioCosto:[this.localData.precioCosto, [Validators.required]],
      precioVenta:[this.localData.precioVenta, [Validators.required]],
      tiempoPreparacion:[this.localData.tiempoPreparacion, [Validators.required]],
      descripcion:[this.localData.descripcion],
      imagen:[this.localData.imagen],
      cantidadVendida:[this.localData.cantidadVendida],
      detalle:[this.localData.detalle],
      categoriaOpciones:[this.opciones]
    });
    
  }

  setAction() {
    this.action = (this.localData.id) ? 'Editar' : 'Añadir';
  }

  onAction() {
    if((this.bandera || this.localData.imagen!==null) && this.dataDetalle!=undefined){
      if(this.imagenPlato.nativeElement.value!=="" && this.imagenPlato.nativeElement.value!==null){
        this.form.controls['imagen'].setValue(this.imagenPlato.nativeElement.value);
      }
      this.form.controls['detalle'].setValue(this.localData.detalle);
      this.dialogRef.close({ event: this.action, data: this.form.value });
      
    }
    
  }

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  }

  public cargarCategoria(id:number):void{
    console.log("ID:" + this.localDataCategoria[id-1]);
    this.form.controls['categoria'].setValue(this.localDataCategoria[id-1]);
  }

  onUpload(e){
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `upload/foto_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    //Imagen subida, ahora recuperamos la imagen
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize( ()=>{
        this.urlImage = ref.getDownloadURL();
        this.bandera = true;
        console.log('Bandera cambiada', this.bandera);
      }  )
    ).subscribe( 
    );
  }
}
