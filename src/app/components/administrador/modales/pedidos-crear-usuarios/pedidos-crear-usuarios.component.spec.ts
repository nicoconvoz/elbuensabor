import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosCrearUsuariosComponent } from './pedidos-crear-usuarios.component';

describe('PedidosCrearUsuariosComponent', () => {
  let component: PedidosCrearUsuariosComponent;
  let fixture: ComponentFixture<PedidosCrearUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosCrearUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosCrearUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
