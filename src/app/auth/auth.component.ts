import { Subscription } from 'rxjs';
import { User } from './../interfaces/user';
import { UserService } from './../services/user.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registrationForm: FormGroup;

  isLoginActive = true;
  userSubs: Subscription;
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.resetLoginForm();
  }

  resetLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  resetRegistrationForm(): void {
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordAgain: new FormControl('', Validators.required),
    });
  }

  setIsLoginActive(): void {
    if (this.isLoginActive) {
      this.resetRegistrationForm();
    } else {
      this.resetLoginForm();
    }
    this.isLoginActive = !this.isLoginActive;
  }

  submit(): void {
    if (this.isLoginActive) {
      this.loginUser();
    } else {
      const user: User = {};
      this.createUser(user);
    }
  }

  /* checkPasswords(): string {
    if()

    return
  } */

  createUser(user: User): void {
    this.userSubs = this.userService.create(user).subscribe(
      (res: any) => {
        console.log(res.message);
      },
      (error) => {
        this.snackBar.open(error.message);
      }
    );
  }

  loginUser(): void {
    this.userSubs = this.userService
      .auth(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        (res: any) => {
          console.log(res.message);
        },
        (error) => {
          this.snackBar.open(error.message);
        }
      );
  }
}
