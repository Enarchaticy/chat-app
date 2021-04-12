import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((token) => {
      if (token) {
        localStorage.setItem('user', JSON.stringify(token));
        this.router.navigate(['/room']);

        const user: User = {
          name: token.displayName,
          email: token.email,
          isOnline: true,
        };
        this.createOrUpdateUser(token.uid, user).pipe(first()).subscribe();
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  register(
    email: string,
    password: string
  ): Observable<void | firebase.auth.UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  updateName(user: firebase.User, displayName: string): Observable<void> {
    return from(user.updateProfile({ displayName }));
  }

  login(
    email: string,
    password: string
  ): Observable<void | firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  facebookAuth(): Observable<void | firebase.auth.UserCredential> {
    return from(this.thirdPartyLogin(new firebase.auth.FacebookAuthProvider()));
  }

  googleAuth(): Observable<void | firebase.auth.UserCredential> {
    return this.thirdPartyLogin(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  thirdPartyLogin(provider): Observable<void | firebase.auth.UserCredential> {
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

  createOrUpdateUser(id: string, user: User): Observable<void> {
    const identifier = [id, user.email];
    return from(
      this.firestore
        .collection('user')
        .doc(id)
        .set({ ...user, identifier })
    );
  }

  getUserByIdOrEmail(id: string): Observable<User[]> {
    return this.firestore
      .collection('user', (ref) =>
        ref.where('identifier', 'array-contains', id)
      )
      .valueChanges();
  }

  getOnlineUsers(): Observable<User[]> {
    return this.firestore
      .collection('user', (ref) =>
        ref
          .where('isOnline', '==', true)
          .where('email', '!=', JSON.parse(localStorage.getItem('user')).email)
      )
      .valueChanges();
  }
}
