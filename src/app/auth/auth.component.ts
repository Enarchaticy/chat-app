import { Router } from '@angular/router';
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
    private snackBar: MatSnackBar,
    private router: Router
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
      this.loginUser();
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

  createUser(user: User): void {
    this.userSubs = this.userService.create(user).subscribe(
      (res: any) => {
        if (res.message === 'Successful registration') {
          this.snackBar.open('Successful registration!', null, {
            duration: 2000,
          });
          setTimeout(() => {
            this.setIsLoginActive();
          }, 1500);
        } else {
          this.snackBar.open(res.message, null, {
            duration: 2000,
          });
        }
      },
      (error) => {
        this.snackBar.open(error.message, null, { duration: 2000 });
      }
    );
  }

  loginUser(): void {
    this.userSubs = this.userService
      .auth(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        (res: any) => {
          if (res.id) {
            localStorage.setItem('id', res.id);
            localStorage.setItem('name', res.name);
            localStorage.setItem('token', 'generatedToken');
            this.router.navigate(['/room']);
          }
          if (res.message) {
            this.snackBar.open(res.message, null, { duration: 2000 });
          }
        },
        (error) => {
          this.snackBar.open(error.message, null, { duration: 2000 });
        }
      );
  }
}
