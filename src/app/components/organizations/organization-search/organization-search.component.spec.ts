import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSearchComponent } from './organization-search.component';

describe('SearchComponent', () => {
  let component: OrganizationSearchComponent;
  let fixture: ComponentFixture<OrganizationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
