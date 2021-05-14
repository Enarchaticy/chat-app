import { LayoutModule } from '@angular/cdk/layout';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { RoomComponent } from './room.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MOCK_OTHER_USER,
  MOCK_PRIVATE_ROOM,
  NGRX_INITIAL_STATE,
  setStorageUser,
} from '../test/utils';
import { RoomService } from '../services/room.service';
import { of } from 'rxjs';
import { UserService } from '../services/user.service';
import { DialogService } from './dialogs/dialog.service';
import { AuthComponent } from '../auth/auth.component';
import { useMockStorage } from '../test/mock-storage';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { setDirectMessage } from './store/direct-messages.actions';
import { setRoom } from './store/room.actions';

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;
  let roomService: jasmine.SpyObj<RoomService>;
  let userService: jasmine.SpyObj<UserService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let store: MockStore;

  beforeEach(async () => {
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      getAllVisible: of(null),
    });
    userService = jasmine.createSpyObj<UserService>('UserService', {
      getOnline: of(),
      logout: of(null),
      updateIsOnline: of(null),
    });
    dialogService = jasmine.createSpyObj<DialogService>('DialogService', {
      openDialog: null,
    });

    TestBed.configureTestingModule({
      declarations: [RoomComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
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
        NoopAnimationsModule,
        LayoutModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        OverlayModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: RoomService, useValue: roomService },
        { provide: DialogService, useValue: dialogService },
        provideMockStore({ initialState: NGRX_INITIAL_STATE }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    useMockStorage();
    setStorageUser();
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should onInit call userService geOnline and roomService getAllVisible', () => {
    expect(userService.getOnline).toHaveBeenCalledTimes(1);
    expect(roomService.getAllVisible).toHaveBeenCalledTimes(1);
    component.ngOnInit();
    expect(userService.getOnline).toHaveBeenCalledTimes(2);
    expect(roomService.getAllVisible).toHaveBeenCalledTimes(2);
  });

  it('should openCreateRoomDialog open a dialog', () => {
    component.openCreateRoomDialog();
    expect(dialogService.openDialog).toHaveBeenCalledTimes(1);
  });

  it('should openCreateRoomDialog open a dialog', () => {
    component.logout();
    expect(userService.logout).toHaveBeenCalledTimes(1);
    expect(userService.updateIsOnline).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('user')).toBe(null);
  });

  it('should openCreateRoomDialog open a dialog', () => {
    const spyOnStore = spyOn(store, 'dispatch');
    component.setUserForDirectMessage(MOCK_OTHER_USER);

    expect(spyOnStore).toHaveBeenCalledTimes(1);
    expect(spyOnStore).toHaveBeenCalledOnceWith(
      setDirectMessage(MOCK_OTHER_USER)
    );
  });

  it('should openCreateRoomDialog open a dialog', () => {
    const spyOnStore = spyOn(store, 'dispatch');
    component.setRoomToOpen(MOCK_PRIVATE_ROOM);

    expect(spyOnStore).toHaveBeenCalledTimes(1);
    expect(spyOnStore).toHaveBeenCalledOnceWith(
      setRoom(MOCK_PRIVATE_ROOM)
    );
  });
});
