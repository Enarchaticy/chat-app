import { User } from './../../interfaces/user';
import { Message } from './../../interfaces/message';
import { AuthorizeRoomDialogComponent } from './../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { DialogService } from './../dialogs/dialog.service';
import { Room, Visibility } from './../../interfaces/room';
import { Observable } from 'rxjs';
import { RoomService } from './../../services/room.service';
import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, first, take } from 'rxjs/operators';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnChanges {
  @Input() roomInput: Room;
  @Output() setDefault = new EventEmitter();
  @Output() getDirectMessages = new EventEmitter<User>();

  room: Room;
  messages: any;
  chat = '';

  room$: Observable<Room>;

  constructor(
    private roomService: RoomService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {}

  ngOnChanges(): void {
    this.getRoomById();
  }

  getDirectMessagesWithUser(user: User): void {
    if (user.id !== localStorage.getItem('id')) {
      this.getDirectMessages.emit(user);
    }
  }

  // messagePrettier és groupBy csopotosítja a messages tömböt a küldés napja alapján
  messagePrettier(room: Room): void {
    this.messages = this.groupBy(
      room.messages.map((message) => {
        return {
          ...message,
          timestamp:
            message.date.getFullYear() +
            '/' +
            (message.date.getMonth() + 1) +
            '/' +
            message.date.getDate(),
        };
      }),
      'timestamp'
    );
  }

  groupBy(list, by): any {
    return list.reduce((r, a) => {
      r[a[by]] = r[a[by]] || [];
      r[a[by]].push(a);
      return r;
    }, []);
  }

  getRoom(...args: string[]): void {
    this.room$ = this.roomService
      .getRoom(this.roomInput.visibility, ...args)
      .pipe(
        tap((res: any) => {
          if (res && res.messages) {
            this.room = res;
            this.messagePrettier(res);
          } else {
            if (res) {
              this.snackBar.open(res.message, null, { duration: 2000 });
              this.setDefault.emit('');
            }
          }
        })
      );
  }

  getRoomById(): void {
    if (this.roomInput.visibility === Visibility.private) {
      this.getRoom(this.roomInput.id, localStorage.getItem('id'));
    } else if (this.roomInput.visibility === Visibility.protected) {
      this.openAuthorizeRoomDialog();
      this.handleClosedDialog();
    } else {
      this.getRoom(this.roomInput.id);
    }
  }

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
      this.messagePrettier(this.room);
    }
    this.chat = '';
  }

  sendMessage(message: Message): void {
    this.roomService
      .sendMessage(this.roomInput.id, message)
      .pipe(first())
      .subscribe();
  }

  openAuthorizeRoomDialog(): void {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    this.dialogService.openDialog<AuthorizeRoomDialogComponent>(
      containerPortal
    );
  }

  handleClosedDialog(): void {
    this.dialogService.dataSubject.pipe(take(2)).subscribe((password) => {
      if (password && typeof password === 'string') {
        this.getRoom(this.roomInput.id, password as string);
      }
    });
  }
}
