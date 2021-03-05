import { Observable } from 'rxjs';
import { Room } from './../interfaces/room';
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
}
