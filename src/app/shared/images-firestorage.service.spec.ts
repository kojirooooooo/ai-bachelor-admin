import { TestBed } from '@angular/core/testing';

import { ImagesFirestorageService } from './images-firestorage.service';

describe('ImagesFirestorageService', () => {
  let service: ImagesFirestorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesFirestorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
