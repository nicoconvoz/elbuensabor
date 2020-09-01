import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetallePedidoComponent } from './modal-detalle-pedido.component';

describe('ModalDetallePedidoComponent', () => {
  let component: ModalDetallePedidoComponent;
  let fixture: ComponentFixture<ModalDetallePedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetallePedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetallePedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
