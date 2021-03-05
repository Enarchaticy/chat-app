import { AuthorizeRoomDialogComponent } from './../dialogs/authorize-room-dialog/authorize-room-dialog.component';
import { DialogService } from './../dialogs/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Room, Visibility } from './../../interfaces/room';
import { Subscription } from 'rxjs';
import { RoomService } from './../../services/room.service';
import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnDestroy, OnChanges {
  // @Input() roomId: string;
  @Input() roomInput: Room;

  userId = '1';

  room: Room;
  roomSubs: Subscription;
  passwordSubs: Subscription;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnChanges(): void {
    this.getRoomById();
  }

  ngOnDestroy(): void {
    if (this.roomSubs) {
      this.roomSubs.unsubscribe();
    }
  }

  getRoomById(): void {
    // ezt ha van lehetőség javítani

    if (this.roomInput.visibility === Visibility.private) {
      this.roomSubs = this.roomService
        .getPrivate(this.roomInput.id, this.userId)
        .subscribe(
          (result: Room) => {
            console.log(result);
            this.room = result;
          },
          (error) => {
            console.error(error);
          },
          () => {
            if (!this.room) {
              this.router.navigate(['/room', 'me']);
            }
          }
        );
    } else if (this.roomInput.visibility === Visibility.protected) {
      this.openAuthorizeRoomDialog();
      this.handleClosedDialog();
    } else {
      this.roomSubs = this.roomService.getPublic(this.roomInput.id).subscribe(
        (result: Room) => {
          this.room = result;
        },
        (error) => {
          console.error(error);
        },
        () => {
          if (!this.room) {
            this.router.navigate(['/room', 'me']);
          }
        }
      );
    }
  }

  openAuthorizeRoomDialog(): void {
    const containerPortal = new ComponentPortal(
      AuthorizeRoomDialogComponent,
      null
    );
    this.dialogService.openAuthorizeRoomDialog<AuthorizeRoomDialogComponent>(
      containerPortal
    );
  }

  handleClosedDialog(): void {
    this.passwordSubs = this.dialogService.passwordSubject.subscribe(
      (password) => {
        if (password) {
          this.roomSubs = this.roomService
            .getProtected(this.roomInput.id, password as string)
            .subscribe(
              (result: Room) => {
                this.room = result;
              },
              (error) => {
                console.error(error);
              },
              () => {
                this.passwordSubs.unsubscribe();
                if (!this.room || !this.room.id) {
                  console.error('Not authorized!');
                  this.router.navigate(['/room', 'me']);
                }
              }
            );
        }
      }
    );
  }
}
