import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePlatoComponent } from './detalle-plato.component';

describe('DetallePlatoComponent', () => {
  let component: DetallePlatoComponent;
  let fixture: ComponentFixture<DetallePlatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePlatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
