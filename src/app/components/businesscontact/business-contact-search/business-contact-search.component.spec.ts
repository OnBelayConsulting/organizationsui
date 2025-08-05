import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessContactSearchComponent } from './business-contact-search.component';

describe('BusinessContactSearchComponent', () => {
  let component: BusinessContactSearchComponent;
  let fixture: ComponentFixture<BusinessContactSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessContactSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessContactSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
