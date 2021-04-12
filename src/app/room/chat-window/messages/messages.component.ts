import { Message } from './../../../interfaces/message';
import { AuthorizeRoomDialogComponent } from './../../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { tap, first, map } from 'rxjs/operators';
import { Room, Visibility } from './../../../interfaces/room';
import { Observable } from 'rxjs';
import { RoomService } from './../../../services/room.service';
import { User } from './../../../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from './../../dialogs/dialog.service';
import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

interface MessageWithDay extends Message {
  timestamp: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnChanges {
  @Input() private roomInput: Room;
  @Input() private newMessage: Message;
  @Output() private setDefault = new EventEmitter();
  @Output() private observeDirectMessages = new EventEmitter<User>();

  room$: Observable<Room>;
  messages;
  room: Room;

  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private roomService: RoomService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.roomInput) {
      this.handleRoomInput();
    } else {
      this.messagePrettier(this.room);
    }
  }

  switchToDirectMessagesWithUser(user: User): void {
    if (user.id !== JSON.parse(localStorage.getItem('user')).displayName) {
      this.observeDirectMessages.emit(user);
    }
  }

  private observeRoom(roomId: string, password?: string): void {
    this.room$ = this.roomService
      .getRoomFromFirestore(this.roomInput.visibility, roomId, password)
      .pipe(
        tap((res: Room) => {
          if (res[0]) {
            this.room = res[0];
            this.messagePrettier(this.room);
          } else {
            this.snackBar.open('Szoba nem érhető el', null, { duration: 2000 });
            this.setDefault.emit('');
          }
        })
      );
  }

  private handleRoomInput(): void {
    if (this.roomInput.visibility === Visibility.private) {
      this.observeRoom(this.roomInput.id);
    } else if (this.roomInput.visibility === Visibility.protected) {
      this.openAuthorizeRoomDialog();
    } else {
      this.observeRoom(this.roomInput.id);
    }
  }

  private openAuthorizeRoomDialog(): void {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    this.dialogService.openDialog<AuthorizeRoomDialogComponent>(
      containerPortal
    );
    this.observePassword();
  }

  private observePassword() {
    this.roomService.password$.pipe(first()).subscribe((password) => {
      this.observeRoom(this.roomInput.id, password);
    });
  }

  private messagePrettier(room: Room): void {
    this.messages = this.groupBy(
      room.messages.map((message) => ({
        ...message,
        timestamp: message.date.toISOString().substr(0, 10),
      })),
      'timestamp'
    );
  }

  private groupBy(messages: MessageWithDay[], by: string) {
    return messages.reduce((r, a) => {
      r[a[by]] = r[a[by]] || [];
      r[a[by]].push(a);
      return r;
    }, []);
  }
}
