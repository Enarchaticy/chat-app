import { Message } from './../../interfaces/message';
import { AuthorizeRoomDialogComponent } from './../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { DialogService } from './../dialogs/dialog.service';
import { Router } from '@angular/router';
import { Room, Visibility } from './../../interfaces/room';
import { Subscription } from 'rxjs';
import { RoomService } from './../../services/room.service';
import { Component, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnDestroy, OnChanges {
  @Input() roomInput: Room;
  @Output() setDefault = new EventEmitter();


  room: Room;
  messages: any;
  chat = '';

  roomSubs: Subscription;
  passwordSubs: Subscription;
  sendMessageSubs: Subscription;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {}

  ngOnChanges(): void {
    this.getRoomById();
  }

  ngOnDestroy(): void {
    if (this.roomSubs) {
      this.roomSubs.unsubscribe();
    }
    if (this.sendMessageSubs) {
      this.sendMessageSubs.unsubscribe();
    }
  }

  messagePrettier(): void {
    this.messages = this.groupBy(
      this.room.messages.map((message) => {
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
    this.roomSubs = this.roomService
      .getRoom(this.roomInput.visibility, ...args)
      .subscribe(
        (result: Room | any) => {
          if (result && result.id) {
            this.room = result;
            this.messagePrettier();
          } else if (result && result.message) {
            this.snackBar.open(result.message, null, { duration: 2000 });
            this.setDefault.emit('');
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          if (!this.room) {
            this.router.navigate(['/room']);
          }
        }
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
      this.messagePrettier();
    }
    this.chat = '';
  }

  sendMessage(message: Message): void {
    this.sendMessageSubs = this.roomService
      .sendMessage(this.roomInput.id, message)
      .subscribe();
  }

  openAuthorizeRoomDialog(): void {
    const containerPortal = new ComponentPortal(
      AuthorizeRoomDialogComponent,
      null
    );
    this.dialogService.openDialog<AuthorizeRoomDialogComponent>(
      containerPortal
    );
  }

  handleClosedDialog(): void {
    this.passwordSubs = this.dialogService.dataSubject.subscribe((password) => {
      if (password && typeof password === 'string') {
        console.log(password);
        this.getRoom(this.roomInput.id, password as string);
        this.passwordSubs.unsubscribe();
    /*     if (!this.room || !this.room.id) {
          console.error('Not authorized!');
          this.router.navigate(['/room']);
        } */

        /* this.roomSubs = this.roomService
          .getProtected(this.roomInput.id, password as string)
          .subscribe(
            (result: Room) => {
              this.room = result;
              this.messagePrettier();
            },
            (error) => {
              console.error(error);
            },
            () => {
              this.passwordSubs.unsubscribe();
              if (!this.room || !this.room.id) {
                console.error('Not authorized!');
                this.router.navigate(['/room']);
              }
            }
          ); */
      }
    });
  }
}
