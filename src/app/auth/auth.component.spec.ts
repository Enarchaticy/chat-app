import { CommonModule } from '@angular/common';
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
import { setStorageUser } from '../interfaces/user';
import { RoomComponent } from '../room/room.component';
import { UserService } from '../services/user.service';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj<UserService>('UserService', {
      register: of(),
      login: of(),
    });

    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        RouterTestingModule.withRoutes([
          { path: 'auth', component: AuthComponent },
          { path: 'room', component: RoomComponent },
          { path: '**', redirectTo: '/room', pathMatch: 'full' },
        ]),
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
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
    component.resetLoginForm();
    component.resetRegistrationForm();
    component.isLoginActive = true;
    component.submit();
    expect(userService.login).toHaveBeenCalledTimes(1);
    expect(userService.register).toHaveBeenCalledTimes(0);

    component.isLoginActive = false;
    component.submit();
    expect(userService.login).toHaveBeenCalledTimes(1);
    expect(userService.register).toHaveBeenCalledTimes(1);
  });

  it('should submit check if password and passwordAgain is the same', () => {
    component.resetRegistrationForm();
    component.isLoginActive = false;

    component.registrationForm.value.password = 'testPassword';
    component.registrationForm.value.passwordAgain = 'otherTestPassword';
    component.submit();
    expect(userService.register).toHaveBeenCalledTimes(0);

    component.registrationForm.value.passwordAgain = 'testPassword';
    component.submit();
    expect(userService.register).toHaveBeenCalledTimes(1);
  });
});
