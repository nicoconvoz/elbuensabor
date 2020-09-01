import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosAgrupadosPorClienteComponent } from './pedidos-agrupados-por-cliente.component';

describe('PedidosAgrupadosPorClienteComponent', () => {
  let component: PedidosAgrupadosPorClienteComponent;
  let fixture: ComponentFixture<PedidosAgrupadosPorClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosAgrupadosPorClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosAgrupadosPorClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
