import firebase from 'firebase/app';
/* eslint-disable no-underscore-dangle */
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from './../interfaces/message';
import { from, Observable } from 'rxjs';
import { Room, Visibility } from './../interfaces/room';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ElementSchemaRegistry } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private _newRoom: Room;
  private _password: string;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {}

  create(room: Room): Observable<unknown> {
    return this.http.post('room', room);
  }

  getDirectMessages(myId: string, friendId: string): Observable<unknown> {
    const params = new HttpParams()
      .append('type', 'direct')
      .append('myId', myId)
      .append('friendId', friendId);
    return this.http.get('room', { params });
  }

  getRoom(type: string, ...args: string[]): Observable<unknown> {
    let params;
    if (type === Visibility.public) {
      params = new HttpParams().append('type', type).append('id', args[0]);
    } else if (type === Visibility.protected) {
      params = new HttpParams()
        .append('type', type)
        .append('id', args[0])
        .append('password', args[1]);
    } else if (type === Visibility.private) {
      params = new HttpParams()
        .append('type', type)
        .append('id', args[0])
        .append('userId', args[1]);
    }
    return this.http.get('room', { params });
  }

  getVisible(userId: string): Observable<unknown> {
    const params = new HttpParams()
      .append('type', 'visible')
      .append('userId', userId);
    return this.http.get('room', { params });
  }

  sendMessage(id: string, message: Message): Observable<unknown> {
    const params = new HttpParams().append('id', id);
    return this.http.put('room', message, { params });
  }

  createRoom(room: Room): Observable<unknown> {
    const roomToUpload: any = room;
    if (room.members) {
      roomToUpload.memberIds = [];
      room.members.map((member) => {
        console.log((member as any).identifier);
        roomToUpload.memberIds.push(member.id || (member as any).identifier[0]);
        return member;
      });
    }
    console.log(roomToUpload);
    return from(this.firestore.collection('room').add(roomToUpload));
  }

  getRoomFromFirestore(
    id: string,
    visibility: Visibility,
    password?: string
  ): Observable<unknown> {
    return from(
      this.firestore
        .collection('room', (ref) => {
          const query = firebase.firestore().collection('book');
          query.where('id', '==', id);
          query.where('visibility', '==', visibility);
          if (visibility === Visibility.private) {
            query.where(
              'memberIds',
              'array-contains',
              JSON.parse(localStorage.getItem('token')).id
            );
          } else if (visibility === Visibility.protected) {
            query.where('password', '==', password);
          }
          return query;
        })
        .valueChanges()
    );
  }

  getDirectMessagesFromFirestore(userId: string): Observable<unknown> {
    return from(
      this.firestore
        .collection('room', (ref) =>
          ref.where('memberIds', 'array-contains', [
            JSON.parse(localStorage.getItem('token')).id,
            userId,
          ])
        )
        .valueChanges()
    );
  }

  getAllRoom(visibility: Visibility): Observable<unknown> {
    return from(
      this.firestore
        .collection('room', (ref) => {
          const query = firebase.firestore().collection('book');
          query.where('visibility', '==', visibility);
          /* query.select('id', 'name', 'visibility'); */
          return query;
        })
        .valueChanges()
    );
  }

  getAllPrivateRoom(): Observable<unknown> {
    return from(
      this.firestore
        .collection('room', (ref) => {
          const query = firebase.firestore().collection('book');
          query.where('visibility', '==', 'private');
          query.where(
            'memberIds',
            'array-contains',
            JSON.parse(localStorage.getItem('token')).id
          );
          /* query.select('id', 'name', 'visibility', 'members'); */
          return query;
        })
        .valueChanges()
    );
  }

  get newRoom() {
    return this._newRoom;
  }

  set newRoom(room: Room) {
    this._newRoom = room;
  }

  get password() {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
  }
}
