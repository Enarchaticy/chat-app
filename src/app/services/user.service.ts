import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
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
        this.createOrUpdateUser(token.uid, user).pipe(first()).subscribe();
      } else {
        localStorage.setItem('user', null);
      }
      this.auth()
        .pipe(first())
        .subscribe((res: any) => {
          if (res.id) {
            console.log(res);
            localStorage.setItem('id', res.id);
            if (res.name && res.name !== 'null') {
              localStorage.setItem('name', res.name);
            }
            // localStorage.setItem('name', res.name);
            this.router.navigate(['/room']);
          }
        });
    });
  }

  register(email: string, password: string): Observable<unknown> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  updateName(user, displayName: string): Observable<unknown> {
    return from(user.updateProfile({ displayName }));
  }

  login(email: string, password: string): Observable<unknown> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  facebookAuth(): Observable<unknown> {
    return from(this.thirdPartyLogin(new firebase.auth.FacebookAuthProvider()));
  }

  googleAuth(): Observable<unknown> {
    return this.thirdPartyLogin(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Observable<unknown> {
    return from(this.afAuth.signOut());
  }

  thirdPartyLogin(provider): Observable<unknown> {
    return from(
      this.afAuth.signInWithPopup(provider).catch((error) => {
        console.error(error);
      })
    );
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

  createOrUpdateUser(id: string, user: User): Observable<unknown> {
    return from(this.firestore.collection('user').doc(id).set(user));
  }

  getUserByIdOrEmail(id: string): Observable<unknown> {
    return this.firestore
      .collection('user', (ref) => ref.where('email', '==', 'bence@valami.hu'))
      .valueChanges();
  }

  getOnlineUsers(): Observable<unknown> {
    return this.firestore
      .collection('user', (ref) => ref.where('isOnline', '==', true))
      .valueChanges();
  }
}
