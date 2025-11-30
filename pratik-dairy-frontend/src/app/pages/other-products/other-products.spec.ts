import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherProducts } from './other-products';

describe('OtherProducts', () => {
  let component: OtherProducts;
  let fixture: ComponentFixture<OtherProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
