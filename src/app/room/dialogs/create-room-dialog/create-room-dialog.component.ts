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
      this.createRoom(this.finalizeRoom(room));
    }
  }

  // ha a szobának van passwordja, akkor azt hozzáadja, ha a membersben vannak id-k akkor hozzárendeli a felhasználót hozzá
  finalizeRoom(room: Room): Room {
    if (
      room.visibility === Visibility.public ||
      room.visibility === Visibility.protected
    ) {
      return room;
    }
    return {
      name: room.name,
      visibility: room.visibility,
      members: this.getUsersByIdOrEmail(room.members),
    };
  }

  getUsersByIdOrEmail(membersId: User[]): User[] {
    const members = [];
    membersId.map((member: User) => {
      if (member.id === localStorage.getItem('id')) {
        members.push({
          id: localStorage.getItem('id'),
          name: localStorage.getItem('name'),
        });
      } else {
        this.userService
          .getByIdOrEmail(member.id)
          .pipe(first())
          .subscribe(
            (res) => {
              members.push(res);
              if (members.length === membersId.length) {
                return;
              }
            },
            (error) => {
              console.error(error);
              return;
            }
          );
      }
    });
    return members;
  }

  createRoom(room: Room): void {
    this.roomService
      .create(room)
      .pipe(first())
      .subscribe((result: any) => {
        this.snackBar.open(result.message, null, {
          duration: 2000,
        });
        this.dialogService.closeDialog(
          result.room,
          'CreateRoomDialogComponent'
        );
      });
  }
}
