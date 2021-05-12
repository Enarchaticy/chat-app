import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { first, map, mergeMap } from 'rxjs/operators';
import { Visibility } from 'src/app/interfaces/room';
import { User } from 'src/app/interfaces/user';
import { RoomService } from 'src/app/services/room.service';

import {
  CREATE_DIRECT_MESSAGE,
  SET_DIRECT_MESSAGE,
} from './direct-messages.actions';
import { SET_ROOM } from './room.actions';

@Injectable()
export class DirectMessagesEffects {
  setDirectMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_DIRECT_MESSAGE),
      mergeMap((action: User) =>
        this.roomService.getDirectMessages(action.identifier[0]).pipe(
          first(),
          map((rooms) => {
            if (rooms.length > 0) {
              return { ...rooms[0], type: SET_ROOM };
            } else {
              return { ...action, type: CREATE_DIRECT_MESSAGE };
            }
          })
        )
      )
    )
  );

  createDirectMessage$ = createEffect(() => {
    const token = JSON.parse(localStorage.getItem('user'));
    return this.actions$.pipe(
      ofType(CREATE_DIRECT_MESSAGE),
      mergeMap((action: User) =>
        this.roomService
          .create({
            visibility: Visibility.private,
            memberIds: [
              action.identifier[0] + token.uid,
              token.uid + action.identifier[0],
              action.identifier[0],
              token.uid,
            ],
            members: [
              action,
              {
                id: token.uid,
                name: token.displayName,
              },
            ],
            memberNumber: 2,
          })
          .pipe(
            first(),
            map(() => ({ ...action, type: SET_ROOM }))
          )
      )
    );
  });

  constructor(private actions$: Actions, private roomService: RoomService) {}
}
