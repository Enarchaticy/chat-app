import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', null);
      }
      this.auth().subscribe((res: any) => {
        if (res.id) {
          localStorage.setItem('id', res.id);
          localStorage.setItem('name', res.name);
          this.router.navigate(['/room']);
        }
      });
    });
  }

  async register(email: string, password: string): Promise<void> {
    await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async facebookAuth(): Promise<any> {
    await this.thirdPartyLogin(new firebase.auth.FacebookAuthProvider());
  }

  async googleAuth(): Promise<any> {
    await this.thirdPartyLogin(new firebase.auth.GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  async thirdPartyLogin(provider): Promise<any> {
    return await this.afAuth.signInWithPopup(provider).catch((error) => {
      console.log(error);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  create(user: User): Observable<unknown> {
    return this.http.post('user', user);
  }

  auth(): Observable<unknown> {
    return this.http.post('user/auth', undefined);
  }

  getByIdOrEmail(id: string): Observable<unknown> {
    const params = new HttpParams().append('id', id);
    return this.http.get('user', { params });
  }

  getOnline(id: string): Observable<unknown> {
    const params = new HttpParams().append('id', id);
    return this.http.get('user/online', { params });
  }
}
