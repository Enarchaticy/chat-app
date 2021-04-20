import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthComponent } from 'src/app/auth/auth.component';
import {
  MOCK_PRIVATE_ROOM,
  MOCK_PUBLIC_ROOM,
  Visibility,
} from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { RoomComponent } from '../../room.component';

import { CreateRoomDialogComponent } from './create-room-dialog.component';

describe('CreateRoomDialogComponent', () => {
  let component: CreateRoomDialogComponent;
  let fixture: ComponentFixture<CreateRoomDialogComponent>;
  let roomService: jasmine.SpyObj<RoomService>;
  let userService: jasmine.SpyObj<UserService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      create: of(),
    });
    userService = jasmine.createSpyObj<UserService>('UserService', {
      getByIdOrEmail: of(),
    });
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', {
      open: undefined,
    });

    await TestBed.configureTestingModule({
      declarations: [CreateRoomDialogComponent],
      imports: [
        OverlayModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        RouterTestingModule.withRoutes([
          { path: 'auth', component: AuthComponent },
          { path: 'room', component: RoomComponent },
          { path: '**', redirectTo: '/room', pathMatch: 'full' },
        ]),
        BrowserAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: RoomService, useValue: roomService },
        { provide: UserService, useValue: userService },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should finalizeRoom handle private and other rooms differently', () => {
    component.finalizeRoom(MOCK_PRIVATE_ROOM);
    expect(roomService.create).toHaveBeenCalledTimes(0);
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(1);

    component.finalizeRoom(MOCK_PUBLIC_ROOM);
    expect(roomService.create).toHaveBeenCalledTimes(1);
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(1);
  });

  it('should finalizeRoom check if private room does not have at least 3 members', () => {
    component.finalizeRoom({
      members: [{ id: 'asdasd' }],
      visibility: Visibility.private,
    });
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(0);
    expect(snackBar.open).toHaveBeenCalledTimes(1);

    component.finalizeRoom(MOCK_PRIVATE_ROOM);
    expect(userService.getByIdOrEmail).toHaveBeenCalledTimes(1);
    expect(snackBar.open).toHaveBeenCalledTimes(1);
  });
});
