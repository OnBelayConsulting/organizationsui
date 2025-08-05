import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessContactEditComponent } from './business-contact-edit.component';

describe('BusinessContactEditComponent', () => {
  let component: BusinessContactEditComponent;
  let fixture: ComponentFixture<BusinessContactEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessContactEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
