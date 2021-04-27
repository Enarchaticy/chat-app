import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { useMockStorage } from 'src/app/test/mock-storage';
import { MOCK_PUBLIC_ROOM, setStorageUser } from 'src/app/test/utils';
import { environment } from 'src/environments/environment';

import { ChatWindowComponent } from './chat-window.component';

describe('ChatWindowComponent', () => {
  let component: ChatWindowComponent;
  let fixture: ComponentFixture<ChatWindowComponent>;
  let roomService: jasmine.SpyObj<RoomService>;

  beforeEach(async () => {
    // todo subject használata új értékek emittálására
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      sendMessage: of(null),
    });

    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      declarations: [ChatWindowComponent],
      providers: [{ provide: RoomService, useValue: roomService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowComponent);
    component = fixture.componentInstance;
    component.roomInput = MOCK_PUBLIC_ROOM;
    useMockStorage();
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not send message if chat is empty', () => {
    component.chat = '';
    component.submitMessage();
    expect(roomService.sendMessage).toHaveBeenCalledTimes(0);
  });

  it('should send message if chat is not empty', () => {
    component.chat = 'chat message';
    component.submitMessage();
    expect(roomService.sendMessage).toHaveBeenCalledTimes(1);
    expect(component.chat).toBe('');
  });
});
