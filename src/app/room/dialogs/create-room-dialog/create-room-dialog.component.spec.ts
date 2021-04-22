import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Visibility } from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import {
  MOCK_PRIVATE_ROOM,
  MOCK_PROTECTED_ROOM,
  MOCK_PUBLIC_ROOM,
} from 'src/app/test/utils';
import { environment } from 'src/environments/environment';
import { DialogService } from '../dialog.service';

import { CreateRoomDialogComponent } from './create-room-dialog.component';

describe('CreateRoomDialogComponent', () => {
  let component: CreateRoomDialogComponent;
  let fixture: ComponentFixture<CreateRoomDialogComponent>;
  let roomService: jasmine.SpyObj<RoomService>;
  let userService: jasmine.SpyObj<UserService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      create: of(MOCK_PUBLIC_ROOM),
    });
    userService = jasmine.createSpyObj<UserService>('UserService', {
      getByIdOrEmail: of([]),
    });
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    dialogService = jasmine.createSpyObj<DialogService>('DialogService', {
      closeDialog: undefined,
    });

    await TestBed.configureTestingModule({
      declarations: [CreateRoomDialogComponent],
      imports: [
        OverlayModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: RoomService, useValue: roomService },
        { provide: UserService, useValue: userService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: DialogService, useValue: dialogService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // todo: elküldeni azokat a private elemekes megoldásokat amiket nem tudok másképp megvalósítani
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // todo: szétszedni két külön tesztesetbe(ezt a többi helyen is ahol ilyen van)
  it('should finalizeRoom send private room to getByIdOrEmail function', () => {
    component.finalizeRoom(MOCK_PRIVATE_ROOM);
    expect(roomService.create).toHaveBeenCalledTimes(0);
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(1);
  });

  it('should finalizeRoom send public and protected room to create function', () => {
    component.finalizeRoom(MOCK_PUBLIC_ROOM);
    expect(roomService.create).toHaveBeenCalledTimes(1);
    expect(dialogService.closeDialog).toHaveBeenCalledTimes(1);
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(0);

    component.finalizeRoom(MOCK_PROTECTED_ROOM);
    expect(roomService.create).toHaveBeenCalledTimes(2);
    expect(dialogService.closeDialog).toHaveBeenCalledTimes(2);
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(0);
  });

  it('should not save private room if it does not have three member', () => {
    component.finalizeRoom({
      members: [{ id: 'emptyPrivateRoomId' }],
      visibility: Visibility.private,
    });
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(0);
    expect(
      snackBar.open
    ).toHaveBeenCalledWith(
      'You have to add at least 3 person to your group',
      null,
      { duration: 2000 }
    );
  });

  it('should save private room if it does have three member', () => {
    component.finalizeRoom(MOCK_PRIVATE_ROOM);
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(1);
    expect(snackBar.open).toHaveBeenCalledWith('wrong ids and emails!', null, {
      duration: 2000,
    });
  });
});
