import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';
import { useMockStorage } from '../test/mock-storage';
import { setStorageUser } from '../test/utils';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj<UserService>('UserService', {
      register: of(),
      login: of(),
      facebookAuth: of(null),
      googleAuth: of(null),
      updateName: of(undefined),
      create: of(undefined),
    });

    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        CommonModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      declarations: [AuthComponent],
      providers: [{ provide: UserService, useValue: userService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    useMockStorage();
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change between login and registration form', () => {
    const spyOnResetRegistrationForm = spyOn(
      component,
      'resetRegistrationForm'
    );
    const spyOnResetLoginForm = spyOn(component, 'resetLoginForm');

    component.setIsLoginActive();
    expect(component.isLoginActive).toBe(false);
    expect(spyOnResetRegistrationForm).toHaveBeenCalledTimes(1);

    component.setIsLoginActive();
    expect(component.isLoginActive).toBe(true);
    expect(spyOnResetLoginForm).toHaveBeenCalledTimes(1);
  });

  it('should submit check, if login or register is active', () => {
    component.isLoginActive = true;
    component.submit();

    expect(userService.login).toHaveBeenCalledTimes(1);
    expect(userService.register).toHaveBeenCalledTimes(0);
  });

  it('should submit check, if login or register is active', () => {
    component.resetRegistrationForm();
    component.isLoginActive = false;
    component.submit();

    expect(userService.login).toHaveBeenCalledTimes(0);
    expect(userService.register).toHaveBeenCalledTimes(1);
  });

  it('should submit not call register if the passwords not the same', () => {
    component.resetRegistrationForm();
    component.isLoginActive = false;

    component.registrationForm.value.password = 'firstTestPassword';
    component.registrationForm.value.passwordAgain = 'notTheSameTestPassword';
    component.submit();
    expect(userService.register).toHaveBeenCalledTimes(0);
  });

  it('should submit call register if the passwords are the same', () => {
    component.resetRegistrationForm();
    component.isLoginActive = false;

    component.registrationForm.value.password = 'secondTestPassword';
    component.registrationForm.value.passwordAgain = 'secondTestPassword';
    component.submit();
    expect(userService.register).toHaveBeenCalledTimes(1);
  });

  it('should register with correct data create new user and change the name', () => {
    component.resetRegistrationForm();
    component.isLoginActive = false;

    component.registrationForm.value.email = 'new@user.com';
    component.registrationForm.value.name = 'newUser';
    component.registrationForm.value.password = 'secondTestPassword';
    component.registrationForm.value.passwordAgain = 'secondTestPassword';
    userService.register.and.returnValue(
      of({ user: { uid: 'newUserId' } } as any)
    );
    component.submit();

    expect(userService.register).toHaveBeenCalledWith(
      'new@user.com',
      'secondTestPassword'
    );
    expect(userService.updateName).toHaveBeenCalledTimes(1);
    expect(userService.updateName).toHaveBeenCalledWith(
      { uid: 'newUserId' } as any,
      'newUser'
    );
    expect(userService.create).toHaveBeenCalledTimes(1);
    expect(userService.create).toHaveBeenCalledWith('newUserId', {
      isOnline: true,
      name: 'newUser',
      email: 'new@user.com',
    });
  });

  it('should loginWithFacebook call facebookAuth in userService', () => {
    component.loginWithFacebook();
    expect(userService.facebookAuth).toHaveBeenCalledTimes(1);
  });

  it('should loginWithFacebook call facebookAuth in userService', () => {
    component.loginWithGoogle();
    expect(userService.googleAuth).toHaveBeenCalledTimes(1);
  });
});
