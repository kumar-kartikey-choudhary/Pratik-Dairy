import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweetsMenu } from './sweets-menu';

describe('SweetsMenu', () => {
  let component: SweetsMenu;
  let fixture: ComponentFixture<SweetsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SweetsMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SweetsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
