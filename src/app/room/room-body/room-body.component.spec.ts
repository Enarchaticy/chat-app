import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MOCK_PUBLIC_ROOM, Visibility } from 'src/app/interfaces/room';
import { MOCK_OTHER_USER } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

import { RoomBodyComponent } from './room-body.component';

describe('RoomBodyComponent', () => {
  let component: RoomBodyComponent;
  let fixture: ComponentFixture<RoomBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomBodyComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnChanges handle user and room differently', () => {
    const defaultRoom = {
      name: 'me',
      id: 'me',
      visibility: Visibility.public,
    };

    const observeDirectMessages = spyOn(component, 'observeDirectMessages');
    component.roomToOpen = undefined;
    component.userForDirectMessage = undefined;
    (component.ngOnChanges as any)({
      userForDirectMessage: true,
      roomToOpen: false,
    });
    expect(observeDirectMessages).toHaveBeenCalledTimes(0);
    expect(component.roomInput).toEqual(defaultRoom);

    (component.ngOnChanges as any)({
      userForDirectMessage: false,
      roomToOpen: true,
    });
    expect(observeDirectMessages).toHaveBeenCalledTimes(0);
    expect(component.roomInput).toEqual(defaultRoom);

    component.roomToOpen = MOCK_PUBLIC_ROOM;
    component.userForDirectMessage = MOCK_OTHER_USER;
    (component.ngOnChanges as any)({
      userForDirectMessage: true,
      roomToOpen: false,
    });
    expect(component.roomInput).toEqual(defaultRoom);
    expect(observeDirectMessages).toHaveBeenCalledTimes(1);
    expect(observeDirectMessages).toHaveBeenCalledWith(MOCK_OTHER_USER);

    (component.ngOnChanges as any)({
      userForDirectMessage: false,
      roomToOpen: true,
    });
    expect(component.roomInput).toEqual(MOCK_PUBLIC_ROOM);
    expect(observeDirectMessages).toHaveBeenCalledTimes(1);
  });
});
