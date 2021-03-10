import { Message } from './../interfaces/message';
import { Observable } from 'rxjs';
import { Room, Visibility } from './../interfaces/room';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

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

  getPublic(id: string): Observable<unknown> {
    const params = new HttpParams().append('type', 'public').append('id', id);
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

  getProtected(id: string, password: string): Observable<unknown> {
    const params = new HttpParams()
      .append('type', 'protected')
      .append('id', id)
      .append('password', password);
    return this.http.get('room', { params });
  }

  getPrivate(id: string, userId: string): Observable<unknown> {
    const params = new HttpParams()
      .append('type', 'private')
      .append('id', id)
      .append('userId', userId); // userId ha nem kell akkor törölni
    return this.http.get('room', { params });
  }

  getVisible(userId: string): Observable<unknown> {
    const params = new HttpParams()
      .append('type', 'visible')
      .append('userId', userId); // userId ha nem kell akkor törölni
    return this.http.get('room', { params });
  }

  sendMessage(id: string, message: Message): Observable<unknown> {
    const params = new HttpParams().append('id', id);
    return this.http.put('room', message, { params });
  }
}
