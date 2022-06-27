import { TestBed } from '@angular/core/testing';

import { LynMetService } from './lyn-met.service';

describe('LynMetService', () => {
  let service: LynMetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LynMetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
