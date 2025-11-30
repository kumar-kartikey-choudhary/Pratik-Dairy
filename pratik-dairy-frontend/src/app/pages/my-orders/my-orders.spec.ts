import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrders } from './my-orders';

describe('MyOrders', () => {
  let component: MyOrders;
  let fixture: ComponentFixture<MyOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
