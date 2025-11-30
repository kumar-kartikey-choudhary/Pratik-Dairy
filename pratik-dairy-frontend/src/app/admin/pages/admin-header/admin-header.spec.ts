import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeader } from './admin-header';

describe('AdminHeader', () => {
  let component: AdminHeader;
  let fixture: ComponentFixture<AdminHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
