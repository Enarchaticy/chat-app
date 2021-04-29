import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreModule,
  QueryFn,
} from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthComponent } from '../auth/auth.component';
import { RoomComponent } from '../room/room.component';
import { useMockStorage } from '../test/mock-storage';
import { MOCK_AUTH_USER } from '../test/utils';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let afAuth: jasmine.SpyObj<AngularFireAuth>;
  let firestore: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    afAuth = jasmine.createSpyObj<AngularFireAuth>('AngularFireAuth', {
      createUserWithEmailAndPassword: Promise.resolve(undefined),
      signInWithEmailAndPassword: Promise.resolve(undefined),
      signInWithPopup: Promise.resolve(undefined),
      signOut: Promise.resolve(undefined),
    });
    (afAuth as any).authState = of({
      displayName: null,
      isAnonymous: true,
      uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2',
    });

    firestore = jasmine.createSpyObj<AngularFirestore>('AngularFirestore', {
      collection: {
        doc: () =>
          ({
            update: () => of(undefined),
            set: () => of(undefined),
          } as unknown),
        valueChanges: () => of(undefined),
      } as AngularFirestoreCollection<unknown>,
    });

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
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
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AngularFireAuth, useValue: afAuth },
        {
          provide: AngularFirestore,
          useValue: firestore,
        },
      ],
    });
    useMockStorage();
    service = TestBed.inject(UserService);
    firestore.collection.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if there is an authenticated user', () => {
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      displayName: null,
      isAnonymous: true,
      uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2',
    });
  });

  it('should register call createUserWithEmailAndPassword method', () => {
    service.register('auth@user.com', 'password');
    expect(afAuth.createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(afAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      'auth@user.com',
      'password'
    );
  });

  it('should login call signInWithEmailAndPassword method', () => {
    service.login('auth@user.com', 'password');
    expect(afAuth.signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(afAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      'auth@user.com',
      'password'
    );
  });

  it('should test logout method', () => {
    service.logout();
    expect(afAuth.signOut).toHaveBeenCalledTimes(1);
  });

  it('should create call collection doc set', () => {
    service.create('authUserId', MOCK_AUTH_USER);
    expect(firestore.collection).toHaveBeenCalledTimes(1);
    expect(firestore.collection).toHaveBeenCalledWith('user' as any);
  });

  it('should getByIdOrEmail call collection and valueChanges', () => {
    service.getByIdOrEmail(['authUserId', 'other@user.com']);
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });

  it('should getOnline call collection with valueChanges', () => {
    service.getOnline();
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });
});
