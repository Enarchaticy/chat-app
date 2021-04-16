import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { setStorageUser } from '../interfaces/user';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      declarations: [AuthComponent],
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
    const resetRegistrationForm = (spyOn as any)(
      component,
      'resetRegistrationForm'
    ) as typeof spyOn;
    const resetLoginForm = (spyOn as any)(
      component,
      'resetLoginForm'
    ) as typeof spyOn;

    component.setIsLoginActive();
    expect(component.isLoginActive).toBe(false);
    expect(resetRegistrationForm).toHaveBeenCalledTimes(1);

    component.setIsLoginActive();
    expect(component.isLoginActive).toBe(true);
    expect(resetLoginForm).toHaveBeenCalledTimes(1);
  });

  it('should submit check, if login or register is active', () => {
    component.resetLoginForm();
    component.resetRegistrationForm();
    const createUser = (spyOn as any)(component, 'createUser') as typeof spyOn;
    const loginUserWithEmailAndPassword = (spyOn as any)(
      component,
      'loginUserWithEmailAndPassword'
    ) as typeof spyOn;
    component.isLoginActive = true;
    component.submit();
    expect(loginUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledTimes(0);

    component.isLoginActive = false;
    component.submit();
    expect(loginUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledTimes(1);
  });

  it('should submit check if password and passwordAgain is the same', () => {
    component.resetRegistrationForm();
    const createUser = (spyOn as any)(component, 'createUser') as typeof spyOn;
    component.isLoginActive = false;

    component.registrationForm.value.password = 'asdasd';
    component.registrationForm.value.passwordAgain = 'qweqwe';
    component.submit();
    expect(createUser).toHaveBeenCalledTimes(0);

    component.registrationForm.value.passwordAgain = 'asdasd';
    component.submit();
    expect(createUser).toHaveBeenCalledTimes(1);
  });
});
