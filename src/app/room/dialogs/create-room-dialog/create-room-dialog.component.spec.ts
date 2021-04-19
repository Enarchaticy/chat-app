import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MOCK_PRIVATE_ROOM,
  MOCK_PUBLIC_ROOM,
  Visibility,
} from 'src/app/interfaces/room';
import { environment } from 'src/environments/environment';

import { CreateRoomDialogComponent } from './create-room-dialog.component';

describe('CreateRoomDialogComponent', () => {
  let component: CreateRoomDialogComponent;
  let fixture: ComponentFixture<CreateRoomDialogComponent>;

  beforeEach(async () => {
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
    const createRoom = (spyOn as any)(component, 'createRoom') as typeof spyOn;
    const loadUsersByIdOrEmail = (spyOn as any)(
      component,
      'loadUsersByIdOrEmail'
    ) as typeof spyOn;

    component.finalizeRoom(MOCK_PRIVATE_ROOM);
    expect(createRoom).toHaveBeenCalledTimes(0);
    expect(loadUsersByIdOrEmail).toHaveBeenCalledTimes(1);

    component.finalizeRoom(MOCK_PUBLIC_ROOM);
    expect(createRoom).toHaveBeenCalledTimes(1);
    expect(loadUsersByIdOrEmail).toHaveBeenCalledTimes(1);
  });

  it('should finalizeRoom check if private room does not have at least 3 members', () => {
    const loadUsersByIdOrEmail = (spyOn as any)(
      component,
      'loadUsersByIdOrEmail'
    ) as typeof spyOn;
    const snackBar = (spyOn as any)(
      (component as any).snackBar,
      'open'
    ) as typeof spyOn;

    component.finalizeRoom({
      members: [{ id: 'asdasd' }],
      visibility: Visibility.private,
    });
    expect(loadUsersByIdOrEmail).toHaveBeenCalledTimes(0);
    expect(snackBar).toHaveBeenCalledTimes(1);

    component.finalizeRoom(MOCK_PRIVATE_ROOM);
    expect(loadUsersByIdOrEmail).toHaveBeenCalledTimes(1);
    expect(snackBar).toHaveBeenCalledTimes(1);
  });
});
