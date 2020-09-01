import { TestBed } from '@angular/core/testing';

import { CocineroGuard } from './cocinero.guard';

describe('CocineroGuard', () => {
  let guard: CocineroGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CocineroGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
