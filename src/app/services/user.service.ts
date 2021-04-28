import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { from, Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private authStateSubs: Subscription;
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.authStateSubs = this.afAuth.authState.subscribe((token) => {
      if (token) {
        localStorage.setItem('user', JSON.stringify(token));
        this.router.navigate(['/room']);
        this.updateIsOnline(token.uid, true).pipe(first()).subscribe();
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  updateName(user: firebase.User, displayName: string): Observable<void> {
    return from(user.updateProfile({ displayName }));
  }

  register(
    email: string,
    password: string
  ): Observable<void | firebase.auth.UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  login(
    email: string,
    password: string
  ): Observable<void | firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  facebookAuth(): Observable<void | firebase.auth.UserCredential> {
    return this.thirdPartyLogin(new firebase.auth.FacebookAuthProvider());
  }

  googleAuth(): Observable<void | firebase.auth.UserCredential> {
    return this.thirdPartyLogin(new firebase.auth.GoogleAuthProvider());
  }

  thirdPartyLogin(provider: firebase.auth.AuthProvider): Observable<void | firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(provider));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  create(id: string, user: User): Observable<void> {
    const identifier = [id, user.email];
    return from(
      this.firestore
        .collection('user')
        .doc(id)
        .set({ ...user, identifier })
    );
  }

  updateIsOnline(id: string, isOnline: boolean): Observable<void> {
    return from(this.firestore.collection('user').doc(id).update({ isOnline }));
  }

  getByIdOrEmail(ids: string[]): Observable<User[]> {
    return this.firestore
      .collection('user', (ref) =>
        ref.where('identifier', 'array-contains-any', ids)
      )
      .valueChanges();
  }

  getOnline(): Observable<User[]> {
    return this.firestore
      .collection('user', (ref) =>
        ref
          .where('isOnline', '==', true)
          .where('email', '!=', JSON.parse(localStorage.getItem('user')).email)
      )
      .valueChanges();
  }

  ngOnDestroy() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }
}
