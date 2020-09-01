import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRealizarPedidoDomicilioComponent } from './modal-realizar-pedido-domicilio.component';

describe('ModalRealizarPedidoDomicilioComponent', () => {
  let component: ModalRealizarPedidoDomicilioComponent;
  let fixture: ComponentFixture<ModalRealizarPedidoDomicilioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRealizarPedidoDomicilioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRealizarPedidoDomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
