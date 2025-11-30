import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DairyProducts } from './dairy-products';

describe('DairyProducts', () => {
  let component: DairyProducts;
  let fixture: ComponentFixture<DairyProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DairyProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DairyProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
