import { DialogService } from './../dialog.service';
import { User } from './../../../interfaces/user';
import { first } from 'rxjs/operators';
import { UserService } from './../../../services/user.service';
import { Subscription } from 'rxjs';
import { RoomService } from './../../../services/room.service';
import { Visibility, Room } from './../../../interfaces/room';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss'],
})
export class CreateRoomDialogComponent implements OnInit, OnDestroy {
  createRoomForm: FormGroup;

  selectVisibility: Visibility[] = [
    Visibility.public,
    Visibility.protected,
    Visibility.private,
  ];
  visibility: Visibility = Visibility.public;

  roomSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnDestroy(): void {
    if (this.roomSubs) {
      this.roomSubs.unsubscribe();
    }
  }

  // figyelembe veszi a láthatóságot és aszerint rakja össze a formot, private esetén hozzáadja minket alapértelmezetten a formarrayhoz
  resetForm(event?: any): void {
    if (event) {
      this.visibility = event.value;
    }
    if (this.visibility === Visibility.public) {
      this.createRoomForm = this.fb.group({
        name: ['', Validators.required],
      });
    } else if (this.visibility === Visibility.protected) {
      this.createRoomForm = this.fb.group({
        name: ['', Validators.required],
        password: ['', Validators.required],
      });
    } else {
      this.createRoomForm = this.fb.group({
        name: ['', Validators.required],
        members: this.fb.array([]),
      });
      this.members.push(this.fb.group({ id: [localStorage.getItem('id')] }));
    }
  }

  get members(): FormArray {
    return this.createRoomForm.get('members') as FormArray;
  }

  addMember(): void {
    this.members.push(this.fb.group({ id: [''] }));
  }

  removeMember(i: number): void {
    this.members.removeAt(i);
  }

  submit(): void {
    if (
      this.visibility === Visibility.private &&
      this.createRoomForm.value.members.length < 3
    ) {
      this.snackBar.open(
        'You have to add at least 3 person to your group',
        null,
        { duration: 2000 }
      );
    } else {
      this.createRoom(this.finalizeRoom());
    }
  }

  // ha a szobának van passwordja, akkor azt hozzáadja, ha a membersben vannak id-k akkor hozzárendeli a felhasználót hozzá
  finalizeRoom(): Room {
    const room: Room = {
      name: this.createRoomForm.value.name,
      visibility: this.visibility,
    };
    if (this.createRoomForm.value.password) {
      room.password = this.createRoomForm.value.password;
    }
    if (this.createRoomForm.value.members) {
      room.members = this.getUsersByIdOrEmail();
      return room;
    } else {
      return room;
    }
  }

  getUsersByIdOrEmail(): User[] {
    const members = [];
    this.createRoomForm.value.members.map((member: User) => {
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
              if (members.length === this.createRoomForm.value.members.length) {
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
    this.roomSubs = this.roomService.create(room).subscribe(
      (result: any) => {
        this.snackBar.open(result.message, null, {
          duration: 2000,
        });
        this.dialogService.closeDialog(result.room);
      },
      (error) => {
        this.snackBar.open('Something went wrong!', null, {
          duration: 2000,
        });
        console.error(error);
      }
    );
  }
}
