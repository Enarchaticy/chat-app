import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from './../interfaces/message';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { Room, Visibility } from './../interfaces/room';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  public password$: Observable<string>;
  private passwordSubject: Subject<string> = new Subject();

  set password(password: string) {
    this.passwordSubject.next(password);
  }

  constructor(private firestore: AngularFirestore) {
    this.password$ = this.passwordSubject.asObservable();
  }

  create(room: Room): Observable<Room> {
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

  getRoom(
    visibility: Visibility,
    id: string,
    password?: string
  ): Observable<Room> {
    return this.firestore
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
      .pipe(
        map((res) => {
          if (res.length === 1) {
            return res[0];
          }
          return null;
        })
      );
  }

  sendMessage(id: string, message: Message): Observable<void> {
    return from(
      this.firestore
        .collection('room')
        .doc(id)
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion(message),
        })
    );
  }

  getDirectMessages(userId: string): Observable<Room[]> {
    return this.firestore
      .collection('room', (ref) =>
        ref.where('memberIds', 'array-contains-any', [
          JSON.parse(localStorage.getItem('user')).uid + userId,
          userId + JSON.parse(localStorage.getItem('user')).uid,
        ])
      )
      .valueChanges();
  }

  getAllOther(): Observable<Room[]> {
    return this.firestore
      .collection('room', (ref) => ref.where('visibility', '!=', 'private'))
      .valueChanges();
  }

  getAllPrivate(): Observable<Room[]> {
    return this.firestore
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
      .valueChanges();
  }

  getAllVisible(): Observable<Room[]> {
    return combineLatest([this.getAllPrivate(), this.getAllOther()]).pipe(
      map(([privateRooms, otherRooms]) => [...privateRooms, ...otherRooms])
    );
  }
}
