import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { MOCK_PUBLIC_ROOM } from 'src/app/interfaces/room';
import { setStorageUser } from 'src/app/interfaces/user';
import { RoomService } from 'src/app/services/room.service';
import { environment } from 'src/environments/environment';

import { ChatWindowComponent } from './chat-window.component';

describe('ChatWindowComponent', () => {
  let component: ChatWindowComponent;
  let fixture: ComponentFixture<ChatWindowComponent>;
  let roomService: jasmine.SpyObj<RoomService>;

  beforeEach(async () => {
    roomService = jasmine.createSpyObj<RoomService>('RoomService', {
      sendMessage: of(),
    });

    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      declarations: [ChatWindowComponent],
      providers: [{ provide: RoomService, useValue: roomService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowComponent);
    component = fixture.componentInstance;
    component.roomInput = MOCK_PUBLIC_ROOM;
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if chat is empty after submit', () => {
    component.chat = '';
    component.submitMessage();
    expect(roomService.sendMessage).toHaveBeenCalledTimes(0);

    component.chat = 'asd';
    component.submitMessage();
    expect(roomService.sendMessage).toHaveBeenCalledTimes(1);
    expect(component.chat).toBe('');
  });
});
