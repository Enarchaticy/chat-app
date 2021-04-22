import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthComponent } from '../auth/auth.component';
import { RoomComponent } from '../room/room.component';
import { setStorageUser } from '../test/utils';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'room',
            component: RoomComponent,
          },
          {
            path: 'auth',
            component: AuthComponent,
          },
          { path: '**', redirectTo: '/room', pathMatch: 'full' },
        ]),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should check if the user is logged in or not', () => {
    localStorage.setItem('user', null);
    expect(guard.canActivate()).toBe(false);
    expect(localStorage.length).toBe(0);
    setStorageUser();
    expect(guard.canActivate()).toBe(true);
  });
});
