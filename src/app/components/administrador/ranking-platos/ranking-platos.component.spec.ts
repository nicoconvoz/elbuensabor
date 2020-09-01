import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingPlatosComponent } from './ranking-platos.component';

describe('RankingPlatosComponent', () => {
  let component: RankingPlatosComponent;
  let fixture: ComponentFixture<RankingPlatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingPlatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingPlatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
