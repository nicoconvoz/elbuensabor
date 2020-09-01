import { Categoria } from './../../../../models/Categoria';
import { Component, OnInit, Inject, Optional , ElementRef, ViewChild} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
//imagenes
import { AngularFireStorage } from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.component.html',
  styleUrls: ['./modal-categoria.component.css']
})
export class ModalCategoriaComponent implements OnInit {

  
  public localData: any;
  public action: string;
  public form: FormGroup;

  //imagenes
  uploadPercent : Observable<number>;
  urlImage : Observable<string>;
  urlString : string;
  bandera : boolean = false;
  @ViewChild('imagenPlato')  imagenPlato : ElementRef;

  constructor(public dialogRef: MatDialogRef<ModalCategoriaComponent>,
    public formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Categoria, private datePipe: DatePipe, private storage : AngularFireStorage) {
    this.localData = { ...data };
  }

  ngOnInit(): void {
    this.buildForm();
    this.setAction();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [this.localData.id],
      nombre: [this.localData.nombre, [Validators.required]],
      descripcion: [this.localData.descripcion, [Validators.required]],
      imagen:[this.localData.imagen]
    });
    
  }

  setAction() {
    this.action = (this.localData.id) ? 'Editar' : 'Añadir';
  }

  onAction() {
    if(this.bandera){
      this.form.controls['imagen'].setValue(this.imagenPlato.nativeElement.value);
      this.dialogRef.close({ event: this.action, data: this.form.value });
    }
  }

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
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
