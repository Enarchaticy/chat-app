import { Message } from './../../../interfaces/message';
import { AuthorizeRoomDialogComponent } from './../../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { tap, first, skip } from 'rxjs/operators';
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
import { Store } from '@ngrx/store';
import { SetDirectMessage } from '../../store/direct-messages.actions';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnChanges {
  @Input() roomInput: Room;
  @Output() setDefault = new EventEmitter();
  @Output() observeDirectMessages = new EventEmitter<User>();

  room$: Observable<Room>;
  messages;
  room: Room;

  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private roomService: RoomService,
    private store: Store<{ password: string; directMessages: User }>
  ) {}

  ngOnChanges(): void {
    this.handleRoomInput();
  }

  switchToDirectMessagesWithUser(user: User): void {
    if (user.id !== JSON.parse(localStorage.getItem('user')).uid) {
      user.identifier = [user.id];
      this.store.dispatch(new SetDirectMessage(user));
      /* this.observeDirectMessages.emit(user); */
    }
  }

  private observeRoom(roomId: string, password?: string): void {
    this.room$ = this.roomService
      .getRoom(this.roomInput.visibility, roomId, password)
      .pipe(
        tap((room: Room) => {
          if (room !== null) {
            this.roomInput.id = room.id;
            this.room = room;
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
      this.observeRoom(this.roomInput.queryId);
    } else if (this.roomInput.visibility === Visibility.protected) {
      this.openAuthorizeRoomDialog();
    } else {
      this.observeRoom(this.roomInput.queryId);
    }
  }

  private openAuthorizeRoomDialog(): void {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    this.dialogService.openDialog<AuthorizeRoomDialogComponent>(
      containerPortal
    );
    this.observePassword();
  }

  /* todo: ngrx-ben találni megoldást arra, hogy az elsőt kihagyja, ne itt */
  private observePassword() {
    this.store
      .select('password')
      .pipe(skip(1), first())
      .subscribe((password) => {
        this.observeRoom(this.roomInput.queryId, password);
      });
    /*
    this.roomService.password$.pipe(first()).subscribe((password) => {
      this.observeRoom(this.roomInput.queryId, password);
    }); */
  }

  private messagePrettier(room: Room): void {
    this.messages = this.groupBy(
      room.messages.map((message) => ({
        ...message,
        timestamp: message.date.substr(0, 10),
      })),
      'timestamp'
    );
  }

  private groupBy(messages: Message[], by: string) {
    return messages.reduce((r, a) => {
      r[a[by]] = r[a[by]] || [];
      r[a[by]].push(a);
      return r;
    }, []);
  }
}
