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

  checkMembersNumber(room: Room): void {
    if (room.visibility === Visibility.private && room.members.length < 3) {
      this.snackBar.open(
        'You have to add at least 3 person to your group',
        null,
        { duration: 2000 }
      );
    } else {
      this.finalizeRoom(room);
    }
  }

  // ha a szobának van passwordja, akkor azt hozzáadja, ha a membersben vannak id-k akkor hozzárendeli a felhasználót hozzá
  private finalizeRoom(room: Room) {
    if (
      room.visibility === Visibility.public ||
      room.visibility === Visibility.protected
    ) {
      this.createRoom(room);
    } else {
      this.getUsersByIdOrEmail(room);
    }
  }

  private getUsersByIdOrEmail(room: Room): void {
    const members = [];
    room.memberIds = [];

    room.members.map((member: User) => {
      if (member.id === localStorage.getItem('id')) {
        members.push({
          id: localStorage.getItem('id'),
          name: localStorage.getItem('name'),
        });
        room.memberIds.push(member.id);
      } else {
        this.userService
          .getUserByIdOrEmail(member.id)
          .pipe(first())
          .subscribe(
            (res: User[]) => {
              if (res.length > 0) {
                members.push(res[0]);
                room.memberIds.push(res[0].identifier[0]);
              }
              if (members.length === room.members.length) {
                room.members = members;
                this.createRoom(room);
              }
            },
            (error) => {
              console.error(error);
              this.snackBar.open('something went wrong!', null, {
                duration: 2000,
              });
            }
          );
      }
    });
  }

  private createRoom(room: Room): void {
    this.roomService
      .createRoom(room)
      .pipe(first())
      .subscribe(
        () => {
          this.snackBar.open('Successful room registration!', null, {
            duration: 2000,
          });
          this.dialogService.closeDialog();
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Something went wrong!', null, { duration: 2000 });
        }
      );
  }
}
