import {Injectable} from '@angular/core';
import {
  confirmSignUp,
  fetchAuthSession,
  resendSignUpCode,
  signIn,
  signInWithRedirect,
  signOut,
  signUp
} from 'aws-amplify/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {localStorageKey} from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {
    this.checkCurrentUser();
  }

  public async checkCurrentUser(): Promise<void> {
    try {
      const session = await fetchAuthSession();
      if (session.tokens?.accessToken) {
        this.isLoggedInSubject.next(true);
      } else {
        this.isLoggedInSubject.next(false);
      }
    } catch (e) {
      console.error(e);
      this.isLoggedInSubject.next(false);
    }
  }

  async signUp(email: string, password: string) {
    const signUpOutput = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email
        }
      }
    });
    return signUpOutput;
  }

  async signIn(username: string, password: string) {
    const user = await signIn({username, password});
    this.isLoggedInSubject.next(true);
    return user;
  }

  signInWithGoogle() {
    signInWithRedirect({provider: 'Google'});
  }

  async signOut() {
    try {
      await signOut();
      localStorage.removeItem(localStorageKey)
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/welcome']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async confirmCode(email: string, confirmationCode: string): Promise<void> {
    await confirmSignUp({username: email, confirmationCode});
  }

  async resendCode(email: string): Promise<void> {
    try {
      await resendSignUpCode({username: email});
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
