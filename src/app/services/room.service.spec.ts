import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Visibility } from '../interfaces/room';
import {
  MOCK_AUTH_USER,
  MOCK_PRIVATE_ROOM,
  MOCK_PUBLIC_ROOM,
} from '../test/utils';

import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let firestore: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    firestore = jasmine.createSpyObj<AngularFirestore>('AngularFirestore', {
      collection: ({
        doc: () =>
          ({
            update: () => of(undefined),
          } as unknown),
        valueChanges: () => of(undefined),
        add: () => Promise.resolve(undefined),
      } as unknown) as AngularFirestoreCollection<unknown>,
    });

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AngularFirestore,
          useValue: firestore,
        },
      ],
    });
    service = TestBed.inject(RoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create method call firestore add', () => {
    service.create(MOCK_PUBLIC_ROOM);
    expect(firestore.collection).toHaveBeenCalledTimes(1);

    service.create(MOCK_PRIVATE_ROOM);
    expect(firestore.collection).toHaveBeenCalledTimes(2);
  });

  it('should getRoom get room from firestore', () => {
    service.getRoom(Visibility.public, 'roomId');
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });

  it('should getRoom give null if the result array is empty', () => {
    firestore.collection.and.returnValue({ valueChanges: () => of([]) } as any);
    service
      .getRoom(Visibility.public, 'roomId')
      .subscribe((res) => expect(res).toBe(null));
  });

  it('should getRoom give the first room in result array', () => {
    firestore.collection.and.returnValue({
      valueChanges: () => of([MOCK_PUBLIC_ROOM]),
    } as any);
    service
      .getRoom(Visibility.public, 'roomId')
      .subscribe((res) => expect(res).toBe(MOCK_PUBLIC_ROOM));
  });

  it('should sendMessage send message to a room', () => {
    service.sendMessage('roomId', {
      text: 'First message',
      date: '2020-10-05T14:48:00.000Z',
      author: MOCK_AUTH_USER,
    });
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });

  it('should getDirectMessages get direct messages with param user', () => {
    service.getDirectMessages('userId');
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });

  it('should getAllOther get all public and protected room', () => {
    service.getAllOther();
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });

  it('should getAllPrivate get all private room', () => {
    service.getAllPrivate();
    expect(firestore.collection).toHaveBeenCalledTimes(1);
  });

  it('should getAllVisible combine getAllPrivate and getAllOther observable', () => {
    const getAllPrivateSpyOn = spyOn(service, 'getAllPrivate');
    const getAllOtherSpyOn = spyOn(service, 'getAllOther');
    service.getAllVisible();

    expect(getAllPrivateSpyOn).toHaveBeenCalledTimes(1);
    expect(getAllOtherSpyOn).toHaveBeenCalledTimes(1);
  });
});
