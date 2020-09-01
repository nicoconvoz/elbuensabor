import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRealizarPedidoUsuarioComponent } from './modal-realizar-pedido-usuario.component';

describe('ModalRealizarPedidoUsuarioComponent', () => {
  let component: ModalRealizarPedidoUsuarioComponent;
  let fixture: ComponentFixture<ModalRealizarPedidoUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRealizarPedidoUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRealizarPedidoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
