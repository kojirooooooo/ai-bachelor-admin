import { Component } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';
import { UsersFirestoreService } from './shared/users-firestore.service';
import { User } from './shared/interface/users';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user$: Observable<User | null | undefined> = this.usersfirestore.user$;
  title = 'ai-bachelor-admin';

  constructor(
    private auth: AuthService,
    private usersfirestore: UsersFirestoreService
  ) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user?.userStatus !== 'adminUser') {
        this.auth.authSignOut();
      }
    });
  }
}
