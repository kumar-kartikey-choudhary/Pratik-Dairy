import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnacksAndNamkeens } from './snacks-and-namkeens';

describe('SnacksAndNamkeens', () => {
  let component: SnacksAndNamkeens;
  let fixture: ComponentFixture<SnacksAndNamkeens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnacksAndNamkeens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnacksAndNamkeens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
