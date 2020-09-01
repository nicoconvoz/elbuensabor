import { TestBed } from '@angular/core/testing';

import { CajeroGuard } from './cajero.guard';

describe('CajeroGuard', () => {
  let guard: CajeroGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CajeroGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
