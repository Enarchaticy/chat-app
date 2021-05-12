import { Message } from './../../interfaces/message';
import { Room, Visibility } from './../../interfaces/room';
import { RoomService } from './../../services/room.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnDestroy, OnInit {
  chat = '';
  roomInput: Room = { id: 'me', visibility: Visibility.public };
  storeSubs: Subscription;

  constructor(
    private roomService: RoomService,
    private store: Store<AppState>
  ) {}

  ngOnDestroy() {
    if (this.storeSubs) {
      this.storeSubs.unsubscribe();
    }
  }

  ngOnInit() {
    this.storeSubs = this.store.select('room').subscribe((res) => {
      this.roomInput = res;
    });
  }

  setRoom(room: Room) {
    if (room) {
      this.roomInput = room;
    }
  }

  submitMessage(): void {
    const token = JSON.parse(localStorage.getItem('user'));
    if (this.chat !== '') {
      const message = {
        date: new Date().toISOString(),
        text: this.chat,
        author: {
          id: token.uid,
          name: token.displayName,
        },
      };
      this.sendMessage(message);
    }
    this.chat = '';
  }

  private sendMessage(message: Message): void {
    this.roomService
      .sendMessage(this.roomInput.id, message)
      .pipe(first())
      .subscribe();
  }
}
