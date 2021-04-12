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
export class ChatWindowComponent {
  @Input() roomInput: Room;
  @Output() setDefault = new EventEmitter();
  @Output() observeDirectMessages = new EventEmitter<User>();

  chat = '';
  message: Message;

  constructor(private roomService: RoomService) {}

  submitMessage(): void {
    const token = JSON.parse(localStorage.getItem('user'));
    if (this.chat !== '') {
      const message = {
        date: new Date(),
        text: this.chat,
        author: {
          id: token.uid,
          name: token.displayName,
        },
      };
      this.sendMessage(message);
      this.message = message;
    }
    this.chat = '';
  }

  // TODO: nem tölti fel az üzeneteket firestorerra
  private sendMessage(message: Message): void {
    this.roomService
      .sendMessageToFirestore(this.roomInput.id, message)
      .pipe(first())
      .subscribe();
  }
}
