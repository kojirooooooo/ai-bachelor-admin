import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { authError } from './auth.error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar,
    private afs: AngularFirestore
  ) {}

  async autoId(): Promise<string> {
    const autoId: string = this.afs.createId();
    return autoId;
  }

  async authSignin(login: { email: string; password: string }) {
    return this.afAuth
      .signInWithEmailAndPassword(login.email, login.password)
      .then(() => {
        this.router.navigate(['/']);
        this.snackBar.open('ログインしました', '', {
          duration: 2500,
        });
      })
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  async authSignOut() {
    return this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/auth/sign-in']);
        this.snackBar.open('ログアウトしました', '', {
          duration: 2500,
        });
      })
      .catch((error) => {
        this.alertError(error);
        throw error;
      });
  }

  async resetEmail(email: string): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    if (user) {
      return user
        .updateEmail(email)
        .then(() => {
          return true;
        })
        .catch(async (error) => {
          this.alertError(error);
          return false;
        });
    } else {
      return false;
    }
  }

  async resetPassword(email: string) {
    this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      })
      .catch(async (error) => {
        this.alertError(error);
        return false;
      });
  }

  /************ エラー処理関係 ************/

  async alertError(e: any) {
    if (authError.hasOwnProperty(e.code)) {
      e = authError[e.code];
    }
    alert(e.message);
  }
}
