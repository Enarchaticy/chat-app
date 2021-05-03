import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthComponent } from '../auth/auth.component';
import { RoomComponent } from '../room/room.component';
import { useMockStorage } from '../test/mock-storage';
import { MOCK_AUTH_USER } from '../test/utils';
import { UserService } from './user.service';
import firebase from 'firebase/app';
import 'firebase/auth';

describe('UserService', () => {
  let service: UserService;
  let afAuth: jasmine.SpyObj<AngularFireAuth>;
  let fakeAFS: jasmine.SpyObj<any>;

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

    fakeAFS = jasmine.createSpyObj('AngularFirestore', ['collection']);
    fakeAFS.collection.and.returnValue(
      jasmine.createSpyObj('collection', ['doc', 'valueChanges'])
    );
    fakeAFS
      .collection()
      .doc.and.returnValue(jasmine.createSpyObj('doc', ['update', 'set']));
    fakeAFS.collection().valueChanges.and.returnValue(of([]));
    fakeAFS.collection().doc().update.and.returnValue(Promise.resolve(null));
    fakeAFS.collection().doc().set.and.returnValue(Promise.resolve(null));

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
          useValue: fakeAFS,
        },
      ],
    });
    useMockStorage();
    service = TestBed.inject(UserService);
    fakeAFS.collection().doc().update.calls.reset();
    fakeAFS.collection().doc.calls.reset();
    fakeAFS.collection.calls.reset();
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

  it('should updateName call updateProfile and change display name', () => {
    const user = { updateProfile: (_) => Promise.resolve() };
    const spyOnUser = spyOn(user, 'updateProfile');
    spyOnUser.and.returnValue(Promise.resolve());
    service.updateName(user as firebase.User, 'newName');
    expect(spyOnUser).toHaveBeenCalledTimes(1);
    expect(spyOnUser).toHaveBeenCalledWith({ displayName: 'newName' });
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

  it('should facebookAuth call thirdPartyLogin with FacebookAuthProvider', () => {
    const spyOnThirdPartyLogin = spyOn(service, 'thirdPartyLogin');
    service.facebookAuth();
    expect(spyOnThirdPartyLogin).toHaveBeenCalledTimes(1);
    expect(spyOnThirdPartyLogin).toHaveBeenCalledWith(
      new firebase.auth.FacebookAuthProvider()
    );
  });

  it('should googleAuth call thirdPartyLogin with GoogleAuthProvider', () => {
    const spyOnThirdPartyLogin = spyOn(service, 'thirdPartyLogin');
    service.googleAuth();
    expect(spyOnThirdPartyLogin).toHaveBeenCalledTimes(1);
    expect(spyOnThirdPartyLogin).toHaveBeenCalledWith(
      new firebase.auth.GoogleAuthProvider()
    );
  });

  it('should thirdPartyAuth call afAuth', () => {
    service.thirdPartyLogin(new firebase.auth.FacebookAuthProvider());
    expect(afAuth.signInWithPopup).toHaveBeenCalledTimes(1);
    expect(afAuth.signInWithPopup).toHaveBeenCalledWith(
      new firebase.auth.FacebookAuthProvider()
    );
  });

  it('should test logout method', () => {
    service.logout();
    expect(afAuth.signOut).toHaveBeenCalledTimes(1);
  });

  it('should create call collection doc set', () => {
    service.create('authUserId', MOCK_AUTH_USER);

    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection).toHaveBeenCalledWith('user');
    expect(fakeAFS.collection().doc).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().doc).toHaveBeenCalledWith('authUserId');
    expect(fakeAFS.collection().doc().set).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().doc().set).toHaveBeenCalledWith({
      ...MOCK_AUTH_USER,
      identifier: ['authUserId', MOCK_AUTH_USER.email],
    });
  });

  it('should updateIsOnline update firestore user isOnline property', () => {
    service.updateIsOnline('userId', true);

    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection).toHaveBeenCalledWith('user');
    expect(fakeAFS.collection().doc).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().doc).toHaveBeenCalledWith('userId');
    expect(fakeAFS.collection().doc().update).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().doc().update).toHaveBeenCalledWith({
      isOnline: true,
    });
  });

  it('should getByIdOrEmail call collection and valueChanges', () => {
    service.getByIdOrEmail(['authUserId', 'other@user.com']);

    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().valueChanges).toHaveBeenCalledTimes(1);
  });

  it('should getOnline call collection with valueChanges', () => {
    service.getOnline();

    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().valueChanges).toHaveBeenCalledTimes(1);
  });
});
