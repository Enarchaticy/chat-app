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
      this.observeDirectMessages(this.userForDirectMessage);
    }
    if (changes.roomToOpen && this.roomToOpen) {
      this.roomInput = this.roomToOpen;
    }
  }

  setDefaultRoom(): void {
    this.roomInput = { id: 'me', visibility: Visibility.public };
  }

  observeDirectMessages(friend: User): void {
    this.roomService
      .getDirectMessagesFromFirestore(friend.identifier[0])
      .pipe(first())
      .subscribe(
        (result: Room[]) => {
          if (result.length > 0) {
            this.roomInput = result[0];
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
    const token = JSON.parse(localStorage.getItem('user'));
    this.roomService
      .createRoom({
        visibility: Visibility.private,
        memberIds: [friend.identifier[0], token.uid],
        members: [
          friend,
          {
            id: token.uid,
            name: token.displayName,
          },
        ],
      })
      .pipe(first())
      .subscribe(
        (result: any) => {
          // TODO: felíratkozásnál adat átvétel helyett lekérni a szobákat megint?
          console.log(result);
          this.roomInput = result.room;
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
