import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Visibility } from '../interfaces/room';
import {
  MOCK_AUTH_USER,
  MOCK_PRIVATE_ROOM,
  MOCK_PROTECTED_ROOM,
  MOCK_PUBLIC_ROOM,
} from '../test/utils';

import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let fakeAFS: jasmine.SpyObj<any>;

  beforeEach(() => {
    fakeAFS = jasmine.createSpyObj('AngularFirestore', ['collection']);
    fakeAFS.collection.and.returnValue(
      jasmine.createSpyObj('collection', ['doc', 'valueChanges', 'add'])
    );
    fakeAFS
      .collection()
      .doc.and.returnValue(jasmine.createSpyObj('doc', ['update']));
    fakeAFS.collection().valueChanges.and.returnValue(of([]));
    fakeAFS.collection().add.and.returnValue(Promise.resolve(null));
    fakeAFS.collection().doc().update.and.returnValue(Promise.resolve(null));

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AngularFirestore,
          useValue: fakeAFS,
        },
      ],
    });
    service = TestBed.inject(RoomService);
    fakeAFS.collection().doc.calls.reset();
    fakeAFS.collection.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create method add a room to firestore', () => {
    service.create(MOCK_PUBLIC_ROOM);
    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        ...MOCK_PUBLIC_ROOM,
        messages: [],
      })
    );
  });

  it('should create method add a private room to firestore with members', () => {
    service.create(MOCK_PRIVATE_ROOM);
    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        ...MOCK_PRIVATE_ROOM,
        messages: [],
        memberNumber: 3,
      })
    );
  });

  it('should getRoom get room from firestore', () => {
    service.getRoom(Visibility.public, 'roomId');
    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().valueChanges).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().valueChanges).toHaveBeenCalledWith({
      idField: 'id',
    });
  });

  it('should getRoom give null if the result array is empty', () => {
    service
      .getRoom(Visibility.public, 'roomId')
      .subscribe((res) => expect(res).toBe(null));
  });

  it('should getRoom give the first room in result array', () => {
    fakeAFS.collection.and.returnValue({
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
    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().doc).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().doc).toHaveBeenCalledWith('roomId');

    expect(fakeAFS.collection().doc().update).toHaveBeenCalledTimes(1);
  });

  it('should getDirectMessages get direct messages with param user', () => {
    service.getDirectMessages('userId');
    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().valueChanges).toHaveBeenCalledTimes(1);
  });

  it('should getAllOther get all public and protected room', () => {
    service.getAllOther();
    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().valueChanges).toHaveBeenCalledTimes(1);
  });

  it('should getAllPrivate get all private room', () => {
    service.getAllPrivate();
    expect(fakeAFS.collection).toHaveBeenCalledTimes(1);
    expect(fakeAFS.collection().valueChanges).toHaveBeenCalledTimes(1);
  });

  it('should getAllVisible combine getAllPrivate and getAllOther observable', () => {
    const spyOnGetAllPrivate = spyOn(service, 'getAllPrivate');
    const spyOnGetAllOther = spyOn(service, 'getAllOther');
    service.getAllVisible();

    expect(spyOnGetAllPrivate).toHaveBeenCalledTimes(1);
    expect(spyOnGetAllOther).toHaveBeenCalledTimes(1);
  });

  it('should getAllVisible value is a combination of getAllPrivate and getAllOther observable value', () => {
    const spyOnGetAllPrivate = spyOn(service, 'getAllPrivate');
    const spyOnGetAllOther = spyOn(service, 'getAllOther');
    spyOnGetAllPrivate.and.returnValue(of([MOCK_PRIVATE_ROOM]));
    spyOnGetAllOther.and.returnValue(
      of([MOCK_PUBLIC_ROOM, MOCK_PROTECTED_ROOM])
    );
    service
      .getAllVisible()
      .subscribe((res) =>
        expect(res).toEqual([
          MOCK_PRIVATE_ROOM,
          MOCK_PUBLIC_ROOM,
          MOCK_PROTECTED_ROOM,
        ])
      );
  });
});
