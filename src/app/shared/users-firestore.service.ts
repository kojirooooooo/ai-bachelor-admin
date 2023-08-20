import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ImagesFirestorageService } from './images-firestorage.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first, switchMap } from 'rxjs/operators';
import { Observable, of, lastValueFrom } from 'rxjs';
import { User } from './interface/users';
import { authError } from './auth/auth.error';

@Injectable({
  providedIn: 'root',
})
export class UsersFirestoreService {
  user$: Observable<User | null | undefined> = this.afAuth.authState.pipe(
    switchMap((afUser) => {
      if (afUser) {
        return this.af.doc<User>('user/' + afUser.uid).valueChanges();
      } else {
        return of(null);
      }
    })
  );

  private userDoc?: AngularFirestoreDocument<User>;

  constructor(
    private af: AngularFirestore,
    private afAuth: AngularFireAuth,
    private imagesFirestorage: ImagesFirestorageService,
    private fns: AngularFireFunctions
  ) {}

  async getUserId() {
    const user = await this.afAuth.currentUser;
    if (user) {
      return user.uid;
    } else {
      return null;
    }
  }

  async getUserCurrentEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      return user.email;
    } else {
      return null;
    }
  }

  getMasterUserIdfromInvitationId(invitationId: string) {
    const masterUser = this.af
      .collection<User>('user', (ref) =>
        ref.where('invitationId', '==', invitationId)
      )
      .valueChanges({ idField: 'uid' });
    return masterUser;
  }

  userInit(id: string) {
    this.userDoc = this.af.doc<User>('user/' + id);
    return lastValueFrom(this.userDoc.valueChanges().pipe(first()));
  }

  userSet(user: User, uid: string) {
    this.userDoc = this.af.doc<User>('user/' + uid);
    return this.userDoc.set(user);
  }

  async userCreate(userDoc: {
    displayName: string;
    email: string;
    password: string;
    userStatus: string;
  }) {
    const sleep = (msec: any) =>
      new Promise((resolve) => setTimeout(resolve, msec));
    sleep(1000).then(async () => {
      const callable = this.fns.httpsCallable('createUserByAdmin'); //ユーザー情報をDBに保存
      lastValueFrom(callable(userDoc)).catch((error) => {
        this.alertError(error);
        throw error;
      });
    });
  }

  async callResetEmail(uid: string, email: string) {
    const callable = this.fns.httpsCallable('resetEmailByAdmin');
    lastValueFrom(callable({ userId: uid, email: email })).catch((error) => {
      this.alertError(error);
      throw error;
    });
  }

  async updateEmail(uid: string, email: string): Promise<boolean> {
    this.userDoc = this.af.doc<User>('user/' + uid);
    return this.userDoc
      .update({
        email: email,
      })
      .then(() => {
        return true;
      })
      .catch(async (error) => {
        this.alertError(error);
        return false;
      });
  }

  async userDelete(
    uid: string,
    userStatus: string,
    photoName: string = ''
  ): Promise<boolean> {
    this._deleteUser(uid, photoName).catch(async (error) => {
      this.alertError(error);
      return false;
    });
    return true;
  }

  //ユーザー削除
  private async _deleteUser(userId: string, photoName: string = '') {
    const callable = this.fns.httpsCallable('deleteUserById');
    lastValueFrom(callable({ userId: userId })).then(async () => {
      if (photoName !== '') {
        this.imagesFirestorage.deletePhoto(photoName, 'profileImage');
      }
    });
  }

  //ページングに合わせたユーザーの取得。
  sortUsersListOnPageNumber(
    users: (User & {
      id: string;
    })[],
    pageNum: number
  ) {
    const lastUserIndexNum: number = pageNum * 10 - 1; //該当ページ最後のユーザーインデックス番号
    const firstUserIndexnum: number = pageNum * 10 - 10; //該当ページ最初のユーザーインデックス番号
    const slicedUsers = users.slice(firstUserIndexnum, lastUserIndexNum);
    return slicedUsers;
  }

  //ユーザー一覧取得
  getUsersList(userStatus: string) {
    const usersList = this.af
      .collection<User>('user', (ref) =>
        ref.where('userStatus', '==', userStatus)
      )
      .valueChanges({ idField: 'id' });
    return usersList;
  }

  async alertError(e: any) {
    if (authError.hasOwnProperty(e.code)) {
      e = authError[e.code];
    }
    alert(e.message);
  }
}
