import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaltanteStockComponent } from './faltante-stock.component';

describe('FaltanteStockComponent', () => {
  let component: FaltanteStockComponent;
  let fixture: ComponentFixture<FaltanteStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaltanteStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaltanteStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
