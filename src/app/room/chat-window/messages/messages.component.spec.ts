import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { useMockStorage } from 'src/app/test/mock-storage';
import {
  MOCK_AUTH_USER,
  MOCK_MESSAGES,
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
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let roomService: jasmine.SpyObj<RoomService>;

  beforeEach(async () => {
    dialogService = jasmine.createSpyObj<DialogService>('DialogService', {
      openDialog: null,
    });
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      getRoom: of(MOCK_PUBLIC_ROOM),
    });
    roomService.password$ = of('string');

    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        OverlayModule,
        MatSnackBarModule,
        MatCardModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: DialogService, useValue: dialogService },
        { provide: RoomService, useValue: roomService },
        { provide: MatSnackBar, useValue: snackBar },
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
  it('should navigate to the direct messages with the parameter user if it is not you', () => {
    const observeDirectMessages = spyOn(
      component.observeDirectMessages,
      'emit'
    );
    component.switchToDirectMessagesWithUser({ id: MOCK_OTHER_USER.uid });
    expect(observeDirectMessages).toHaveBeenCalledTimes(1);
  });

  it('should not navigate to the direct messages with the parameter user if it is you', () => {
    const observeDirectMessages = spyOn(
      component.observeDirectMessages,
      'emit'
    );
    component.switchToDirectMessagesWithUser({ id: MOCK_AUTH_USER.uid });
    expect(observeDirectMessages).toHaveBeenCalledTimes(0);
  });

  it('should onChanges call getRoom when room is private or public', () => {
    component.roomInput = MOCK_PUBLIC_ROOM;
    component.ngOnChanges();
    expect(roomService.getRoom).toHaveBeenCalledTimes(1);

    component.roomInput = MOCK_PRIVATE_ROOM;
    component.ngOnChanges();
    expect(roomService.getRoom).toHaveBeenCalledTimes(2);
  });

  it('should ngOnChanges call openDialog only when the room is protected then it is call getRoom too', () => {
    component.roomInput = MOCK_PROTECTED_ROOM;
    component.ngOnChanges();
    expect(dialogService.openDialog).toHaveBeenCalledTimes(1);
    expect(roomService.getRoom).toHaveBeenCalledTimes(1);
  });

  it('should not load room if protected room password and your password is not same', () => {
    const setDefault = spyOn(component.setDefault, 'emit');
    component.roomInput = MOCK_PROTECTED_ROOM;
    roomService.getRoom.and.returnValue(of(null));

    component.ngOnChanges();
    fixture.detectChanges();

    expect(setDefault).toHaveBeenCalledOnceWith('');
    expect(snackBar.open).toHaveBeenCalledOnceWith(
      'Szoba nem érhető el',
      null,
      { duration: 2000 }
    );
  });

  it('should load room if it find some', () => {
    component.roomInput = MOCK_PUBLIC_ROOM;
    roomService.getRoom.and.returnValue(of(MOCK_PUBLIC_ROOM));
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.room).toEqual(MOCK_PUBLIC_ROOM);

    roomService.getRoom.and.returnValue(of(MOCK_PRIVATE_ROOM));
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.room).toEqual(MOCK_PRIVATE_ROOM);
  });

  it('should set messages after load room', () => {
    component.roomInput = MOCK_PUBLIC_ROOM;
    roomService.getRoom.and.returnValue(of(MOCK_PUBLIC_ROOM));
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.room).toEqual(MOCK_PUBLIC_ROOM);

    for (const [index, [timestamp, messages]] of Object.entries(
      Object.entries(component.messages)
    )) {
      expect(timestamp).toBe(MOCK_MESSAGES[index].timestamp);
      expect(messages).toEqual(MOCK_MESSAGES[index].messages);
    }
  });
});
