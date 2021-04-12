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
  public newRoom$: Observable<Room>;
  public password$: Observable<string>;
  private newRoomSubject: Subject<Room> = new Subject();
  private passwordSubject: Subject<string> = new Subject();

  constructor(private firestore: AngularFirestore) {
    this.newRoom$ = this.newRoomSubject.asObservable();
    this.password$ = this.passwordSubject.asObservable();
  }

  createRoom(room: Room): Observable<Room> {
    room = {
      id: Math.floor(Math.random() * 10000000000) + '',
      ...room,
      messages: [],
    };
    from(this.firestore.collection('room').add(room))
      .pipe(first())
      .subscribe(this.newRoomSubject);
    return this.newRoom$;
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
              .where('id', '==', id)
              .where('visibility', '==', visibility);
          } else if (visibility === Visibility.protected) {
            return ref
              .where('id', '==', id)
              .where('visibility', '==', visibility)
              .where('password', '==', password);
          } else {
            return ref
              .where('id', '==', id)
              .where('visibility', '==', visibility)
              .where(
                'memberIds',
                'array-contains',
                JSON.parse(localStorage.getItem('user')).uid
              );
          }
        })
        .valueChanges()
    ).pipe(map((res) => res[0]));
  }
  // TODO: ez valószínű nem jó
  sendMessageToFirestore(id: string, message: Message): Observable<void> {
    let obs;
    this.firestore
      .collection('users', (ref) => ref.where('id', '==', id))
      .get()
      .pipe(first())
      .subscribe((res: firebase.firestore.QuerySnapshot<Room[]>) => {
        obs = from(
          this.firestore
            .collection('users')
            // eslint-disable-next-line @typescript-eslint/dot-notation
            .doc(res['id'])
            .update({
              messages: firebase.firestore.FieldValue.arrayUnion(message),
            })
        );
      });
    return obs;
  }

  getDirectMessagesFromFirestore(userId: string): Observable<Room[]> {
    return from(
      this.firestore
        .collection('room', (ref) =>
          ref.where('memberIds', 'array-contains', [
            JSON.parse(localStorage.getItem('user')).uid,
            userId,
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
  /*  const query = firebase.firestore().collection('book');
          query.where('visibility', '==', 'private');
          query.where(
            'memberIds',
            'array-contains',
            JSON.parse(localStorage.getItem('user')).uid
          );
          query.select('id', 'name', 'visibility', 'members');
          return query;
        }) */

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
        )
        .valueChanges()
    );
  }

  set newRoom(room: Room) {
    this.newRoomSubject.next(room);
  }

  set password(password: string) {
    this.passwordSubject.next(password);
  }
}
