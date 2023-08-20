import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ImagesFirestorageService } from './images-firestorage.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { first, switchMap } from 'rxjs/operators';
import { Observable, of, lastValueFrom } from 'rxjs';
import { AiUser } from './interface/ai-users';

@Injectable({
  providedIn: 'root',
})
export class AiUsersFirestoreService {
  private aiUserDoc?: AngularFirestoreDocument<AiUser>;

  constructor(
    private af: AngularFirestore,
    private imagesFirestorage: ImagesFirestorageService,
    private fns: AngularFireFunctions
  ) {}

  userInit(id: string) {
    this.aiUserDoc = this.af.doc<AiUser>('ai-user/' + id);
    return lastValueFrom(this.aiUserDoc.valueChanges().pipe(first()));
  }

  userSet(user: AiUser, uid: string) {
    this.aiUserDoc = this.af.doc<AiUser>('ai-user/' + uid);
    return this.aiUserDoc.set(user);
  }

  async userCreate(userDoc: AiUser) {
    this.af.collection<AiUser>('ai-user').add(userDoc);
  }
}
