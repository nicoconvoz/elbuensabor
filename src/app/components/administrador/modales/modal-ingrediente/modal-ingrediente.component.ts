import { UnidadMedidaService } from './../../../../services/allServices/unidadMedida.service';
import { UnidadMedida } from './../../../../models/UnidadMedida';
import { InsumoService } from './../../../../services/allServices/insumo.service';
import { Insumo } from './../../../../models/Insumo';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-ingrediente',
  templateUrl: './modal-ingrediente.component.html',
  styleUrls: ['./modal-ingrediente.component.css'],
})
export class ModalIngredienteComponent implements OnInit {
  public localDataUnidadMedida: any;
  public localData: any;
  public localDataInsumo: any;
  public action: string;
  public form: FormGroup;
  public id: number;
  public plato: any;
  public um: String;
  disableSelect = true;
  opciones: String;
  opcionesUm: String;

  constructor(
    public dialogRef: MatDialogRef<ModalIngredienteComponent>,
    public formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    private service: InsumoService,
    private serviceUnidadMedida: UnidadMedidaService
  ) {
    console.log('DATA INGREDIENTES: ' + data.id + data.plato.id);
    if (data.object != undefined) {
      this.localData = data.object;
    }
    this.plato = data.plato;
    console.log(data.plato);
    this.id = data.plato.id;
  }

  ngOnInit(): void {
    this.getAll();
    this.buildForm();
    this.form.controls['plato'].setValue(this.plato);
    this.setAction();
  }

  // getAllUnidadMedida():void{
  //   this.serviceUnidadMedida.getAll().subscribe(data=>{
  //     this.localDataUnidadMedida=data;
  //   });
  // }

  getAll(): void {
    this.service.buscarInsumoporCategoria().subscribe((data) => {
      this.localDataInsumo = data;
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [this.localData.id],
      ingrediente: [this.localData.ingrediente],
      cantidad: [this.localData.cantidad, [Validators.required]],
      opcionesIngrediente: [this.opciones],
      unidadMedidaOpciones: [this.opcionesUm],
      unidadMedida: [this.localData.UnidadMedida],
      plato: [this.localData.plato],
    });
  }

  setAction() {
    this.action = this.localData.id ? 'Editar' : 'Añadir';
  }

  onAction() {
    this.dialogRef.close({
      event: this.action,
      data: { object: this.form.value },
    });
  }

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  };

  cargarIngrediente(ingrediente: Insumo): void {
    console.log(ingrediente);
    console.log("Terminado");
    this.form.controls['ingrediente'].setValue(ingrediente);
    if (
      ingrediente.unidadMedida.abreviatura === 'g'
    ) {
      this.localDataUnidadMedida = [
        { abreviatura: 'kg', eliminado: 'false', id: 2, nombre: 'Kilogramos' }
      ];
    } else if (
      ingrediente.unidadMedida.abreviatura === 'kg'
    ) {
      this.localDataUnidadMedida = [
        { abreviatura: 'g', eliminado: 'false', id: 1, nombre: 'Gramos' }
      ];
    } else if (
      ingrediente.unidadMedida.abreviatura === 'ml' 
    ) {
      this.localDataUnidadMedida = [
        { abreviatura: 'l', eliminado: 'false', id: 4, nombre: 'Litros' }
      ];
    } else if (
      ingrediente.unidadMedida.abreviatura === 'l'
    ) {
      this.localDataUnidadMedida = [
        { abreviatura: 'ml', eliminado: 'false', id: 3, nombre: 'Mililitros' }
      ];
    } else if (ingrediente.unidadMedida.abreviatura === 'u') {
      this.localDataUnidadMedida = [
        { abreviatura: 'u', eliminado: 'false', id: 5, nombre: 'Unidades' }
      ];
    }
    
    this.agregarUnidadMedidaOpciones(this.localDataUnidadMedida);
  }
  agregarUnidadMedida(um: UnidadMedida) {
    this.form.controls['unidadMedida'].setValue(um);
  }
  agregarUnidadMedidaOpciones(um: UnidadMedida) {
    this.form.controls['unidadMedidaOpciones'].setValue(um);
  }
}
