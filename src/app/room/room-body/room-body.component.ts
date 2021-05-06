import { first, skip } from 'rxjs/operators';
import { User } from './../../interfaces/user';
import { RoomService } from './../../services/room.service';
import { Room, Visibility } from './../../interfaces/room';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { SetRoom } from '../store/room.actions';

@Component({
  selector: 'app-room-body',
  templateUrl: './room-body.component.html',
  styleUrls: ['./room-body.component.scss'],
})
export class RoomBodyComponent implements OnInit, OnDestroy {
  storeDirectMessageSubs: Subscription;

  constructor(
    private roomService: RoomService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.storeDirectMessageSubs = this.store
      .select('directMessages')
      .pipe(skip(1))
      .subscribe((res: User) => {
        this.observeDirectMessages(res);
      });
  }

  ngOnDestroy() {
    if (this.storeDirectMessageSubs) {
      this.storeDirectMessageSubs.unsubscribe();
    }
  }

  observeDirectMessages(friend: User): void {
    this.roomService
      .getDirectMessages(friend.identifier[0])
      .pipe(first())
      .subscribe((result: Room[]) => {
        if (result.length > 0) {
          this.store.dispatch(new SetRoom(result[0]));
        } else {
          this.createRoomForDirectMessages(friend);
        }
      });
  }

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
        this.observeDirectMessages(friend);
      });
  }
}
