import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  loading = false;
  login: {
    email: string;
    password: string;
  } = {
    email: '',
    password: '',
  };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  signIn(): void {
    this.loading = true;
    this.auth.authSignin(this.login).finally(() => (this.loading = false));
  }
}
