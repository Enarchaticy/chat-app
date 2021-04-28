import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Visibility } from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';
import { useMockStorage } from 'src/app/test/mock-storage';
import {
  MOCK_AUTH_USER,
  MOCK_OTHER_USER,
  MOCK_PRIVATE_ROOM,
  MOCK_PUBLIC_ROOM,
  setStorageUser,
} from 'src/app/test/utils';
import { environment } from 'src/environments/environment';

import { RoomBodyComponent } from './room-body.component';

describe('RoomBodyComponent', () => {
  let component: RoomBodyComponent;
  let fixture: ComponentFixture<RoomBodyComponent>;
  let roomService: jasmine.SpyObj<RoomService>;

  beforeEach(async () => {
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      create: of(undefined),
      getDirectMessages: of([]),
    });

    await TestBed.configureTestingModule({
      declarations: [RoomBodyComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: RoomService, useValue: roomService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomBodyComponent);
    component = fixture.componentInstance;
    useMockStorage();
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setDefaultRoom set roomInput to default', () => {
    component.setDefaultRoom();
    expect(component.roomInput).toEqual({
      visibility: Visibility.public,
      id: 'me',
    });
  });

  it('should ngOnChanges set roomInput if ', () => {
    component.roomToOpen = MOCK_PUBLIC_ROOM;
    component.ngOnChanges({
      roomToOpen: new SimpleChange(undefined, MOCK_PUBLIC_ROOM, true),
    });
    expect(component.roomInput).toEqual(MOCK_PUBLIC_ROOM);
  });

  /* it('should ngOnChanges handle user input by sending it to observeDirectMessages', () => {
    component.userForDirectMessage = MOCK_OTHER_USER;
    component.ngOnChanges({
      userForDirectMessage: new SimpleChange(undefined, MOCK_AUTH_USER, true),
    });
    expect(roomService.getDirectMessages).toHaveBeenCalledTimes(1);
  }); */
});
