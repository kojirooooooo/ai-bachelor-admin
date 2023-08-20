import { TestBed } from '@angular/core/testing';

import { UsersFirestoreService } from './users-firestore.service';

describe('UsersFirestoreService', () => {
  let service: UsersFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
