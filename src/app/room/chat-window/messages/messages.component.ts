import { Message } from './../../../interfaces/message';
import { AuthorizeRoomDialogComponent } from './../../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { tap, first, skip } from 'rxjs/operators';
import { Room, Visibility } from './../../../interfaces/room';
import { Observable, Subscription } from 'rxjs';
import { RoomService } from './../../../services/room.service';
import { User } from './../../../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from './../../dialogs/dialog.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setDirectMessage } from '../../store/direct-messages.actions';
import { AppState } from '../../store/app.reducer';
import { setDefaultRoom } from '../../store/room.actions';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  room$: Observable<Room>;
  messages;
  room: Room;
  storeSubs: Subscription;
  /*   roomInput: Room;
   */
  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    /* this.storeSubs = this.store.select('room').subscribe((res) => {
      this.roomInput = res;
      this.handleRoomInput();
    }); */

    this.room$ = this.store.select('room').pipe(
      tap((room: Room) => {
        console.log(room);
        if (room !== null) {
          /* this.roomInput = room; */
          if (room.isAuthorized) {
            this.room = room;
            this.messagePrettier(this.room);
          }
          if (room.visibility === Visibility.protected && !room.isAuthorized) {
            this.openAuthorizeRoomDialog();
          }
        } else {
          this.snackBar.open('Szoba nem érhető el', null, { duration: 2000 });
          this.store.dispatch(setDefaultRoom());
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.storeSubs) {
      this.storeSubs.unsubscribe();
    }
  }

  switchToDirectMessagesWithUser(user: User): void {
    if (user.id !== JSON.parse(localStorage.getItem('user')).uid) {
      user.identifier = [user.id];
      this.store.dispatch(setDirectMessage(user));
    }
  }

  /* private observeRoom(roomId: string, password?: string): void {
    this.room$ = this.roomService
      .getRoom(this.roomInput.visibility, roomId, password)
      .pipe(
        tap((room: Room) => {
          if (room !== null) {
            this.room = room;
            this.messagePrettier(this.room);
          } else {
            this.snackBar.open('Szoba nem érhető el', null, { duration: 2000 });
            this.store.dispatch(setDefaultRoom());
          }
        })
      );
  } */

  /* private handleRoomInput(): void {
    if (this.roomInput.isAuthorized) {
      this.room$ = this.store.select('room').pipe(
        tap((room: Room) => {
          if (room !== null) {
            this.room = room;
            this.messagePrettier(this.room);
          } else {
            this.snackBar.open('Szoba nem érhető el', null, { duration: 2000 });
            this.store.dispatch(setDefaultRoom());
          }
        })
      );
    } else if (
      this.roomInput.visibility === Visibility.protected &&
      !this.roomInput.isAuthorized
    ) {
      this.openAuthorizeRoomDialog();
    }
  } */

  private openAuthorizeRoomDialog(): void {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    this.dialogService.openDialog<AuthorizeRoomDialogComponent>(
      containerPortal
    );
    /* this.observePassword(); */
  }

  /* private observePassword() {
    this.store
      .select('room')
      .pipe(skip(1), first())
      .subscribe((res: Room) => {
      });
  } */

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
