import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecaudacionesComponent } from './recaudaciones.component';

describe('RecaudacionesComponent', () => {
  let component: RecaudacionesComponent;
  let fixture: ComponentFixture<RecaudacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecaudacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecaudacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
