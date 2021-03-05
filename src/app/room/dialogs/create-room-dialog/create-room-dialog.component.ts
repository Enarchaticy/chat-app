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

  userId = '1';
  roomSubs: Subscription;
  userName = 'Adam';

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnDestroy(): void {
    if (this.roomSubs) {
      this.roomSubs.unsubscribe();
    }
  }

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
      this.members.push(this.fb.group({ id: [this.userId] }));
    }
  }

  members2(): FormArray {
    return this.createRoomForm.get('members') as FormArray;
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
      console.error('You have to add at least 3 person to your group');
    } else {
      this.createRoom(this.finalizeRoom());
    }
  }

  finalizeRoom(): Room {
    const room: Room = {
      name: this.createRoomForm.value.name,
      visibility: this.visibility,
    };
    if (this.createRoomForm.value.password) {
      room.password = this.createRoomForm.value.password;
    }
    if (this.createRoomForm.value.members) {
      room.members = this.getUsersById();
      return room;
    } else {
      return room;
    }
  }

  getUsersById(): User[] {
    const members = [];
    this.createRoomForm.value.members.map((member: User) => {
      if (member.id === this.userId) {
        members.push({ id: this.userId, name: this.userName });
      } else {
        this.userService
          .getById(member.id)
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
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
