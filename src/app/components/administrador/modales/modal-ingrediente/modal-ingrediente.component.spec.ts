import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIngredienteComponent } from './modal-ingrediente.component';

describe('ModalIngredienteComponent', () => {
  let component: ModalIngredienteComponent;
  let fixture: ComponentFixture<ModalIngredienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIngredienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIngredienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
