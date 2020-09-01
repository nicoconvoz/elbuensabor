import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRealizarPedidoUsuarioCrearComponent } from './modal-realizar-pedido-usuario-crear.component';

describe('ModalRealizarPedidoUsuarioCrearComponent', () => {
  let component: ModalRealizarPedidoUsuarioCrearComponent;
  let fixture: ComponentFixture<ModalRealizarPedidoUsuarioCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRealizarPedidoUsuarioCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRealizarPedidoUsuarioCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
