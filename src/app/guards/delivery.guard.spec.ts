import { TestBed } from '@angular/core/testing';

import { DeliveryGuard } from './delivery.guard';

describe('DeliveryGuard', () => {
  let guard: DeliveryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DeliveryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
