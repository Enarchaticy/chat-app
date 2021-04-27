import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { useMockStorage } from 'src/app/test/mock-storage';
import {
  MOCK_AUTH_USER,
  MOCK_OTHER_USER,
  MOCK_PRIVATE_ROOM,
  MOCK_PROTECTED_ROOM,
  MOCK_PUBLIC_ROOM,
  setStorageUser,
} from 'src/app/test/utils';
import { environment } from 'src/environments/environment';
import { DialogService } from '../../dialogs/dialog.service';

import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let roomService: jasmine.SpyObj<RoomService>;

  beforeEach(async () => {
    dialogService = jasmine.createSpyObj<DialogService>('DialogService', {
      openDialog: null,
    });
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      getRoom: of({}),
      password$: of('string'),
    });

    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        OverlayModule,
        MatSnackBarModule,
        MatCardModule,
      ],
      providers: [
        { provide: DialogService, useValue: dialogService },
        { provide: RoomService, useValue: roomService },
      ],
      declarations: [MessagesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    useMockStorage();
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: keresni más megoldást, amit lehet figyelni, provide
  /* it('should navigate to the direct messages with the parameter user', () => {
    const observeDirectMessages = spyOn(
      (component as any).observeDirectMessages,
      'emit'
    );
    component.switchToDirectMessagesWithUser({ id: MOCK_AUTH_USER.uid });
    expect(observeDirectMessages).toHaveBeenCalledTimes(0);
    component.switchToDirectMessagesWithUser({ id: MOCK_OTHER_USER.uid });
    expect(observeDirectMessages).toHaveBeenCalledTimes(1);
  });

  // TODO: megnézni, hogy messagePrettier-t meg lehet-e így hívni
  it('should group by messages by date', () => {
    (component as any).messagePrettier(MOCK_PUBLIC_ROOM);
    for (const [timestamp, messages] of Object.entries(component.messages)) {
      expect(timestamp).toBe('2020-10-05');
      expect(messages).toEqual([
        { ...messages[0], timestamp: '2020-10-05' },
        { ...messages[1], timestamp: '2020-10-05' },
      ]);
    }
  });

  it('should onChanges call getRoom when room is private or public', () => {
    (component as any).roomInput = MOCK_PUBLIC_ROOM;
    component.ngOnChanges();
    expect(roomService.getRoom).toHaveBeenCalledTimes(1);

    (component as any).roomInput = MOCK_PRIVATE_ROOM;
    component.ngOnChanges();
    expect(roomService.getRoom).toHaveBeenCalledTimes(2);
  });

  it('should ngOnChanges call openDialog only when the room is protected', () => {
    (component as any).roomInput = MOCK_PROTECTED_ROOM;
    component.ngOnChanges();
    expect(dialogService.openDialog).toHaveBeenCalledTimes(1);
  }); */
});
