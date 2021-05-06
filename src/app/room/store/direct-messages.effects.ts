/* import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { first, switchMap } from 'rxjs/operators';
import { Room, Visibility } from 'src/app/interfaces/room';
import { User } from 'src/app/interfaces/user';
import { RoomService } from 'src/app/services/room.service';
import {
  DirectMessagesActions,
  SET_DIRECT_MESSAGE,
} from './direct-messages.actions';

@Injectable()
export class DirectMessagesEffect {
  @Effect()
  setDirectMessages = this.actions$.pipe(
    ofType(SET_DIRECT_MESSAGE),
    switchMap(async (directMessagesData: DirectMessagesActions) => {
      console.log(directMessagesData);
      return this.observeDirectMessages(directMessagesData.payload);
    })
  );

  constructor(private actions$: Actions, private roomService: RoomService) {}

  observeDirectMessages(friend: User) {
    return this.roomService
      .getDirectMessages(friend.identifier[0])
      .pipe(first())
      .subscribe((result: Room[]) => {
        if (result.length > 0) {
          console.log(result);
         // this.store.dispatch(new SetRoom(result[0]));
        } else {
          this.createRoomForDirectMessages(friend);
        }
      });
  }

  private createRoomForDirectMessages(friend: User) {
    const token = JSON.parse(localStorage.getItem('user'));
    return this.roomService
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
} */

/* const observeDirectMessages = (friend: User): void => {
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
};

const createRoomForDirectMessages = (friend: User): void => {
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
}; */
