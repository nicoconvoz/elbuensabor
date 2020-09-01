import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRealizarPedidoDomicilioCrearComponent } from './modal-realizar-pedido-domicilio-crear.component';

describe('ModalRealizarPedidoDomicilioCrearComponent', () => {
  let component: ModalRealizarPedidoDomicilioCrearComponent;
  let fixture: ComponentFixture<ModalRealizarPedidoDomicilioCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRealizarPedidoDomicilioCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRealizarPedidoDomicilioCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
