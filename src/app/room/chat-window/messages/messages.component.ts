import { Message } from './../../../interfaces/message';
import { AuthorizeRoomDialogComponent } from './../../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { first, skip, tap } from 'rxjs/operators';
import { Room, Visibility } from './../../../interfaces/room';
import { Observable, Subscription } from 'rxjs';
import { User } from './../../../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from './../../dialogs/dialog.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { setDirectMessage } from '../../store/direct-messages.actions';
import { AppState } from '../../store/app.reducer';
import { setDefaultRoom } from '../../store/room.actions';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @Output() roomSubmit = new EventEmitter<Room>();

  room$: Observable<Room>;
  messages;
  room: Room;
  storeSubs: Subscription;
  roomInput: Room;

  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private roomService: RoomService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.storeSubs = this.store.select('room').subscribe((res) => {
      this.roomInput = res;
      this.roomSubmit.emit(res);
      this.handleRoomInput();
    });
  }

  switchToDirectMessagesWithUser(user: User): void {
    if (user.id !== JSON.parse(localStorage.getItem('user')).uid) {
      user.identifier = [user.id];
      this.store.dispatch(setDirectMessage(user));
    }
  }

  private observeRoom(roomId: string, password?: string): void {
    this.room$ = this.roomService
      .getRoom(this.roomInput.visibility, roomId, password)
      .pipe(
        tap((room: Room) => {
          if (room !== null) {
            console.log(room);
            this.room = room;
            this.messagePrettier(this.room);
            this.roomSubmit.emit(room);
            // todo: valamiért rosszul működik, kétszer kéri le
            // todo: innen levinni a roomInputot
          } else {
            this.snackBar.open('Szoba nem érhető el', null, { duration: 2000 });
            this.store.dispatch(setDefaultRoom());
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

  private observePassword() {
    this.store
      .select('password')
      .pipe(skip(1), first())
      .subscribe((res: any) => {
        console.log(res.password);
        this.observeRoom(this.roomInput.queryId, res.password);
      });
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
