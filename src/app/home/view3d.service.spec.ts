import { TestBed } from '@angular/core/testing';

import { View3dService } from './view3d.service';

describe('AppService', () => {
  let service: View3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(View3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
