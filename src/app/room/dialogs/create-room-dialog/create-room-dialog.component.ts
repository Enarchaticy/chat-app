import { DialogService } from './../dialog.service';
import { User } from './../../../interfaces/user';
import { first } from 'rxjs/operators';
import { UserService } from './../../../services/user.service';
import { RoomService } from './../../../services/room.service';
import { Visibility, Room } from './../../../interfaces/room';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss'],
})
export class CreateRoomDialogComponent {
  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  finalizeRoom(room: Room) {
    if (room.visibility === Visibility.private) {
      if (room.members.length >= 3) {
        this.loadUsersByIdOrEmail(room);
      } else {
        this.snackBar.open(
          'You have to add at least 3 person to your group',
          null,
          { duration: 2000 }
        );
      }
    } else {
      this.createRoom(room);
    }
  }

  private loadUsersByIdOrEmail(room: Room): void {
    this.userService
      .getByIdOrEmail(room.members.map((member: User) => member.id))
      .pipe(first())
      .subscribe((users: User[]) => {
        if (users.length === room.members.length) {
          room.members = users;
          room.memberIds = users.map((user) => user.identifier[0]);
          this.createRoom(room);
        } else {
          this.snackBar.open('wrong ids and emails!', null, {
            duration: 2000,
          });
        }
      });
  }

  private createRoom(room: Room): void {
    this.roomService
      .create(room)
      .pipe(first())
      .subscribe(() => {
        this.snackBar.open('Successful room registration!', null, {
          duration: 2000,
        });
        this.dialogService.closeDialog();
      });
  }
}
