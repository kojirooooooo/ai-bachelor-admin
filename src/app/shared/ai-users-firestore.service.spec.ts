import { TestBed } from '@angular/core/testing';

import { AiUsersFirestoreService } from './ai-users-firestore.service';

describe('AiUsersFirestoreService', () => {
  let service: AiUsersFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiUsersFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
