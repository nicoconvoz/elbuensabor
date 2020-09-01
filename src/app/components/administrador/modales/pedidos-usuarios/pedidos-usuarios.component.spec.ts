import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosUsuariosComponent } from './pedidos-usuarios.component';

describe('PedidosUsuariosComponent', () => {
  let component: PedidosUsuariosComponent;
  let fixture: ComponentFixture<PedidosUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
