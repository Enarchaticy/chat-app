import { User } from './../interfaces/user';
import { UserService } from './../services/user.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import firebase from 'firebase/app';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registrationForm: FormGroup;

  isLoginActive = true;
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
      passwordAgain: new FormControl(''),
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
      this.loginUserWithEmailAndPassword();
    } else {
      if (
        this.registrationForm.value.password ===
        this.registrationForm.value.passwordAgain
      ) {
        this.createUser({
          email: this.registrationForm.value.email,
          name: this.registrationForm.value.name,
          password: this.registrationForm.value.password,
        });
      } else {
        this.registrationForm.controls.passwordAgain.setErrors({
          incorrect: true,
        });
      }
    }
  }

  loginWithFacebook() {
    this.userService.facebookAuth().pipe(first()).subscribe();
  }

  loginWithGoogle() {
    this.userService.googleAuth().pipe(first()).subscribe();
  }

  private createUser(user: User): void {
    this.userService
      .register(user.email, user.password)
      .pipe(first())
      .subscribe(
        (res: firebase.auth.UserCredential) => {
          this.userService
            .updateName(res.user, user.name)
            .pipe(first())
            .subscribe();
          this.userService
            .create(res.user.uid, {
              isOnline: true,
              name: user.name,
              email: user.email,
            })
            .pipe(first())
            .subscribe();
        },
        () => {
          this.snackBar.open('Something went wrong', null, { duration: 2000 });
        }
      );
  }

  private loginUserWithEmailAndPassword(): void {
    this.userService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(first())
      .subscribe({
        error: () => {
          this.snackBar.open('Wrong credentials', null, { duration: 2000 });
        },
      });
  }
}
