import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthComponent } from '../auth/auth.component';
import { RoomComponent } from '../room/room.component';
import { useMockStorage } from '../test/mock-storage';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let afAuth: jasmine.SpyObj<AngularFireAuth>;
  let firestore: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    afAuth = jasmine.createSpyObj<AngularFireAuth>('AngularFireAuth', {
      createUserWithEmailAndPassword: undefined,
      signInWithEmailAndPassword: undefined,
      signInWithPopup: undefined,
      signOut: Promise.resolve(undefined),
    });
    (afAuth as any).authState = of({
      displayName: null,
      isAnonymous: true,
      uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2',
    });

    firestore = jasmine.createSpyObj<AngularFirestore>('AngularFirestore', {
      collection: {
        doc: () => ({ update: () => of(undefined) } as unknown),
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if there is not authenticated user', () => {
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      displayName: null,
      isAnonymous: true,
      uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2',
    });
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });

  it('should test logout method', () => {
    const obs = service.logout();
    expect(afAuth.signOut).toHaveBeenCalledTimes(1);
    /*     expect(obs.).toEqual(of(Promise.resolve(undefined)));
     */
  });
});
