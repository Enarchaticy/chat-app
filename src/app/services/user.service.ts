import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(user: User): Observable<unknown> {
    return this.http.post('user', user);
  }

  auth(email: string, password: string): Observable<unknown> {
    const params = new HttpParams()
      .append('email', email)
      .append('password', password);
    return this.http.post('user/auth', { params });
  }

  getById(id: string): Observable<unknown> {
    const params = new HttpParams().append('id', id);
    return this.http.get('user', { params });
  }

  getOnline(id: string): Observable<unknown> {
    const params = new HttpParams().append('id', id);
    return this.http.get('user/online', { params });
  }
}
