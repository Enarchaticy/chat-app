import { first } from 'rxjs/operators';
import { User } from './../../interfaces/user';
import { RoomService } from './../../services/room.service';
import { Visibility } from './../../interfaces/room';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.scss'],
})
export class RoomBodyComponent /* implements OnInit, */ /* OnDestroy */ {
  storeDirectMessageSubs: Subscription;

  constructor(
    private roomService: RoomService
  ) /* private store: Store<AppState> */
  {}

  private createRoomForDirectMessages(friend: User): void {
    const token = JSON.parse(localStorage.getItem('user'));
    this.roomService
      .create({
        visibility: Visibility.private,
        memberIds: [
          friend.identifier[0] + token.uid,
          token.uid + friend.identifier[0],
          friend.identifier[0],
          token.uid,
        ],
        members: [
          friend,
          {
            id: token.uid,
            name: token.displayName,
          },
        ],
        memberNumber: 2,
      })
      .pipe(first())
      .subscribe(() => {
        /* this.observeDirectMessages(friend); */
      });
  }
}
