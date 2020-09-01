import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocinaPedidoComponent } from './cocina-pedido.component';

describe('CocinaPedidoComponent', () => {
  let component: CocinaPedidoComponent;
  let fixture: ComponentFixture<CocinaPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocinaPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocinaPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
