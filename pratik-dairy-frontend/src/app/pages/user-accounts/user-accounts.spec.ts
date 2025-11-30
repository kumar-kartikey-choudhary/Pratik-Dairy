import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccounts } from './user-accounts';

describe('UserAccounts', () => {
  let component: UserAccounts;
  let fixture: ComponentFixture<UserAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
