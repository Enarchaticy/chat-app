import { Message } from './../../../interfaces/message';
import { AuthorizeRoomDialogComponent } from './../../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { tap, first } from 'rxjs/operators';
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
} from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnChanges {
  @Input() roomInput: Room;
  @Input() newMessage: Message;
  @Output() setDefault = new EventEmitter();
  @Output() getDirectMessages = new EventEmitter<User>();

  room$: Observable<Room>;
  room: Room;
  messages: any;

  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private roomService: RoomService
  ) {}

  ngOnChanges(changes: any): void {
    if (changes.roomInput) {
      this.getRoomById();
    } else {
      this.messagePrettier(this.room);
    }
  }

  getDirectMessagesWithUser(user: User): void {
    if (user.id !== localStorage.getItem('id')) {
      this.getDirectMessages.emit(user);
    }
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

  openAuthorizeRoomDialog(): void {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    this.dialogService.openDialog<AuthorizeRoomDialogComponent>(
      containerPortal
    );
  }

  handleClosedDialog(): void {
    this.dialogService.passwordSubject$.pipe(first()).subscribe((password) => {
      this.getRoom(this.roomInput.id, password);
    });
  }

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
}
