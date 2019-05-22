import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response} from '@angular/http';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../localStorage/local-storage.service';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../../models/User';
import {auth} from 'firebase';
import {Credentials} from '../../models/credentials';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User>;
  auth$;
  constructor(
    private http: HttpClient,
    private localStr: LocalStorageService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    // this.auth$ = this.afAuth.auth;
    // check if user is logged and return user or null
    this.user$ = this.afAuth.authState;
    // .pipe(
    //   switchMap(user => {
    //     console.log('user:', user);
    //     if (user) {
    //       return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       return of(null);
    //     }
    //   })
    // );
  }

  getAuthState() {
    return this.afAuth.auth;
  }

  registerWithEmail(credentials: Credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  loginWithEmail(credentials: Credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  // facebookLogin() {
  //   const provider = new auth.FacebookAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // oAuthLogin(provider) {
  //   return this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(credential => {
  //       this.updateUserData(credential.user);
  //     })
  //     .catch(err => console.error('error during facebook login:', err));
  // }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  // signIn(user) {
  //   return this.http
  //     .post(API_URL + 'customer/login/', {
  //       email: user.user_email,
  //       password: user.user_password,
  //     })
  //     .pipe();
  // }

  // getUserName(userId, userToken): any {
  //   return this.http
  //     .get(API_URL + 'customer/' + userId, {params: {access_token: userToken}})
  //     .pipe();
  // }

  signUp(user) {
    user.emailVerified = false;
    return this.http.post(API_URL + 'customer', user).pipe();
  }

  // handleError (error: Response | any) {
  //   console.error('ApiService::handleError', error);
  //   return Observable.throwError(error);
  // }

  // confirmEmail(userData) {
  //   return this.http
  //     .get(API_URL + 'customer/confirm', {params: userData})
  //     .pipe();
  // }
}
