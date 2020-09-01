import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlatoComponent } from './modal-plato.component';

describe('ModalPlatoComponent', () => {
  let component: ModalPlatoComponent;
  let fixture: ComponentFixture<ModalPlatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPlatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
