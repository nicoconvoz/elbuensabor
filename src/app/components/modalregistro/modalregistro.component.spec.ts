import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalregistroComponent } from './modalregistro.component';

describe('ModalregistroComponent', () => {
  let component: ModalregistroComponent;
  let fixture: ComponentFixture<ModalregistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalregistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
