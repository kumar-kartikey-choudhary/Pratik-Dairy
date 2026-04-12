import { TestBed } from '@angular/core/testing';

import { CartService } from '../cart/CartService';

describe('Cartservice', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
