import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {
  MOCK_AUTH_USER,
  MOCK_OTHER_USER,
  MOCK_PRIVATE_ROOM,
  MOCK_PUBLIC_ROOM,
} from 'src/app/test/utils';
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
      schemas: [NO_ERRORS_SCHEMA],
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

  it('should ngOnChanges handle user input by sending it to observeDirectMessages', () => {
    const spyOnObserveDirectMessages = spyOn(
      component,
      'observeDirectMessages'
    );

    component.roomInput = MOCK_PUBLIC_ROOM;
    component.ngOnChanges({
      roomToOpen: new SimpleChange(undefined, MOCK_PUBLIC_ROOM, true),
    });
    console.log(component.roomInput);
    expect(component.roomInput).toEqual(MOCK_PUBLIC_ROOM);
    expect(spyOnObserveDirectMessages).toHaveBeenCalledTimes(0);

    component.roomInput = MOCK_PRIVATE_ROOM;
    component.ngOnChanges({
      roomToOpen: new SimpleChange(MOCK_PUBLIC_ROOM, MOCK_PRIVATE_ROOM, false),
    });
    expect(component.roomInput).toEqual(MOCK_PRIVATE_ROOM);
    expect(spyOnObserveDirectMessages).toHaveBeenCalledTimes(0);
  });

  it('should ngOnChanges handle user input by sending it to observeDirectMessages', () => {
    const spyOnObserveDirectMessages = spyOn(
      component,
      'observeDirectMessages'
    );
    component.userForDirectMessage = {};
    component.ngOnChanges({
      userForDirectMessage: new SimpleChange(undefined, MOCK_AUTH_USER, true),
    });
    expect(spyOnObserveDirectMessages).toHaveBeenCalledTimes(1);

    component.ngOnChanges({
      userForDirectMessage: new SimpleChange(
        MOCK_AUTH_USER,
        MOCK_OTHER_USER,
        false
      ),
    });
    expect(spyOnObserveDirectMessages).toHaveBeenCalledTimes(2);
  });
});
