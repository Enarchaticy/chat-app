import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Room } from 'src/app/interfaces/room';
import {
  MOCK_AUTH_USER,
  MOCK_OTHER_USER,
  setStorageUser,
} from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        OverlayModule,
        MatSnackBarModule,
      ],
      declarations: [MessagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the direct messages with the parameter user', () => {
    const observeDirectMessages = (spyOn as any)(
      (component as any).observeDirectMessages,
      'emit'
    ) as typeof spyOn;
    component.switchToDirectMessagesWithUser({ id: MOCK_AUTH_USER.uid });
    expect(observeDirectMessages).toHaveBeenCalledTimes(0);
    component.switchToDirectMessagesWithUser({ id: MOCK_OTHER_USER.uid });
    expect(observeDirectMessages).toHaveBeenCalledTimes(1);
  });

  it('should group by messages by date', () => {
    const room: Room = {
      messages: [
        {
          text: 'asd',
          date: '2020-10-05T14:48:00.000Z',
          author: MOCK_AUTH_USER,
        },
        {
          text: 'qwe',
          date: '2020-10-05T14:49:00.000Z',
          author: MOCK_OTHER_USER,
        },
      ],
    };
    (component as any).messagePrettier(room);
    for (const [timestamp, messages] of Object.entries(component.messages)) {
      expect(timestamp).toBe('2020-10-05');
      expect(messages).toEqual([
        { ...messages[0], timestamp: '2020-10-05' },
        { ...messages[1], timestamp: '2020-10-05' },
      ]);
    }
  });
});
