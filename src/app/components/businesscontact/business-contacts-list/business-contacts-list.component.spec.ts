import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessContactsListComponent } from './business-contacts-list.component';

describe('ListBusinessContactsComponent', () => {
  let component: BusinessContactsListComponent;
  let fixture: ComponentFixture<BusinessContactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessContactsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessContactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
