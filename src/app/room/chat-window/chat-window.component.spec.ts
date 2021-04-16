import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MOCK_ROOM } from 'src/app/interfaces/room';
import { setStorageUser } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

import { ChatWindowComponent } from './chat-window.component';

describe('ChatWindowComponent', () => {
  let component: ChatWindowComponent;
  let fixture: ComponentFixture<ChatWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      declarations: [ChatWindowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowComponent);
    component = fixture.componentInstance;
    component.roomInput = MOCK_ROOM;
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if chat is empty after submit', () => {
    component.chat = '';
    const sendMessage = (spyOn as any)(
      component,
      'sendMessage'
    ) as typeof spyOn;
    component.submitMessage();
    expect(sendMessage).toHaveBeenCalledTimes(0);
    component.chat = 'asd';
    component.submitMessage();
    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(component.chat).toBe('');
  });
});
