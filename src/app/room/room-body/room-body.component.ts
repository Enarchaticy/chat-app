import { first } from 'rxjs/operators';
import { User } from './../../interfaces/user';
import { RoomService } from './../../services/room.service';
import { Room, Visibility } from './../../interfaces/room';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.scss'],
})
export class RoomBodyComponent implements OnChanges {
  @Input() userForDirectMessage: User;
  @Input() roomToOpen: Room;

  roomInput: Room = { name: 'me', id: 'me', visibility: Visibility.public };
  constructor(private roomService: RoomService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userForDirectMessage && this.userForDirectMessage) {
      this.getDirectMessages(this.userForDirectMessage);
    }
    if (changes.roomToOpen && this.roomToOpen) {
      this.roomInput = this.roomToOpen;
    }
  }

  setDefaultRoom(): void {
    this.roomInput = { id: 'me', visibility: Visibility.public };
  }

  getDirectMessages(friend: User): void {
    this.roomService
      .getDirectMessages(localStorage.getItem('id'), friend.id)
      .pipe(first())
      .subscribe(
        (result: Room) => {
          if (result) {
            this.roomInput = result;
          } else {
            this.createRoomForDirectMessages(friend);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private createRoomForDirectMessages(friend: User): void {
    this.roomService
      .create({
        visibility: Visibility.private,
        messages: [],
        members: [
          friend,
          {
            id: localStorage.getItem('id'),
            name: localStorage.getItem('name'),
          },
        ],
      })
      .pipe(first())
      .subscribe(
        (result: any) => {
          this.roomInput = result.room;
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
