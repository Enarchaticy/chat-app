import { User } from './../../interfaces/user';
import { Message } from './../../interfaces/message';
import { Room } from './../../interfaces/room';
import { RoomService } from './../../services/room.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent /* implements OnChanges  */ {
  @Input() roomInput: Room;
  @Output() setDefault = new EventEmitter();
  @Output() getDirectMessages = new EventEmitter<User>();

  chat = '';
  message: Message;

  constructor(private roomService: RoomService) {}

  submitMessage(): void {
    if (this.chat !== '') {
      const message = {
        date: new Date(),
        text: this.chat,
        author: {
          id: localStorage.getItem('id'),
          name: localStorage.getItem('name'),
        },
      };
      this.sendMessage(message);
      this.message = message;
    }
    this.chat = '';
  }

  sendMessage(message: Message): void {
    this.roomService
      .sendMessage(this.roomInput.id, message)
      .pipe(first())
      .subscribe();
  }
}
