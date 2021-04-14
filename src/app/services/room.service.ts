/*eslint no-underscore-dangle: ["error", { "allowAfterThis": true }]*/
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from './../interfaces/message';
import { from, Observable, Subject } from 'rxjs';
import { Room, Visibility } from './../interfaces/room';
import { Injectable } from '@angular/core';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  public password$: Observable<string>;
  private passwordSubject: Subject<string> = new Subject();

  constructor(private firestore: AngularFirestore) {
    this.password$ = this.passwordSubject.asObservable();
  }

  createRoom(room: Room): Observable<Room> {
    room = {
      queryId: Math.floor(Math.random() * 10000000000) + '',
      ...room,
      messages: [],
      ...(room.members && {
        memberNumber: room.memberNumber || room.members.length,
      }),
    };
    return from(this.firestore.collection('room').add(room));
  }

  getRoomFromFirestore(
    visibility: Visibility,
    id: string,
    password?: string
  ): Observable<Room> {
    return from(
      this.firestore
        .collection('room', (ref) => {
          if (visibility === Visibility.public) {
            return ref
              .where('queryId', '==', id)
              .where('visibility', '==', visibility);
          } else if (visibility === Visibility.protected) {
            return ref
              .where('queryId', '==', id)
              .where('visibility', '==', visibility)
              .where('password', '==', password);
          } else {
            return ref
              .where('queryId', '==', id)
              .where('visibility', '==', visibility)
              .where(
                'memberIds',
                'array-contains',
                JSON.parse(localStorage.getItem('user')).uid
              );
          }
        })
        .valueChanges({ idField: 'id' })
    ).pipe(
      map((res) => {
        if (res.length === 1) {
          return res[0];
        }
        return null;
      })
    );
  }
  // TODO: ez valószínű nem jó itt majd a rendes firestore id-t kell használni
  sendMessageToFirestore(id: string, message: Message): Observable<void> {
    return from(
      this.firestore
        .collection('room')
        .doc(id)
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion(message),
        })
    );
  }

  getDirectMessagesFromFirestore(userId: string): Observable<Room[]> {
    return from(
      this.firestore
        .collection('room', (ref) =>
          ref.where('memberIds', 'array-contains-any', [
            JSON.parse(localStorage.getItem('user')).uid + userId,
            userId + JSON.parse(localStorage.getItem('user')).uid,
          ])
        )
        .valueChanges()
    );
  }

  getAllRoom(): Observable<Room[]> {
    return from(
      this.firestore
        .collection('room', (ref) => ref.where('visibility', '!=', 'private'))
        .valueChanges()
    );
  }

  getAllPrivateRoom(): Observable<Room[]> {
    return from(
      this.firestore
        .collection('room', (ref) =>
          ref
            .where('visibility', '==', 'private')
            .where(
              'memberIds',
              'array-contains',
              JSON.parse(localStorage.getItem('user')).uid
            )
            .where('memberNumber', '>=', 3)
        )
        .valueChanges()
    );
  }

  set password(password: string) {
    this.passwordSubject.next(password);
  }
}
