import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((token) => {
      if (token) {
        localStorage.setItem('user', JSON.stringify(token));
        const user: User = {
          name: token.displayName,
          email: token.email,
          isOnline: true,
        };
        this.createOrUpdateUser(token.uid, user).then();
      } else {
        localStorage.setItem('user', null);
      }
      this.auth()
        .pipe(first())
        .subscribe((res: any) => {
          if (res.id) {
            console.log(res);
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
    const token = JSON.parse(localStorage.getItem('user'));
    const user: User = {
      name: token.displayName,
      email: token.email,
      isOnline: false,
    };
    this.createOrUpdateUser(token.uid, user).then();
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  async thirdPartyLogin(provider): Promise<any> {
    return await this.afAuth.signInWithPopup(provider).catch((error) => {
      console.error(error);
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

  createOrUpdateUser(id: string, user: User): any {
    return this.firestore.collection('user').doc(id).set(user);
  }

  getUserByIdOrEmail(id: string): any {
    return this.firestore
      .collection('user', (ref) => ref.where('email', '==', 'bence@valami.hu'))
      .valueChanges();
  }

  getOnlineUsers(): any {
    return this.firestore
      .collection('user', (ref) => ref.where('isOnline', '==', true))
      .valueChanges();
  }
}
