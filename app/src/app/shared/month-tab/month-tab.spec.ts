import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthTab } from './month-tab';

describe('MonthTab', () => {
  let component: MonthTab;
  let fixture: ComponentFixture<MonthTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
