import { TestBed } from '@angular/core/testing';

import { BusinessContactService } from './business-contact.service';

describe('BusinessContactService', () => {
  let service: BusinessContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
