import {Injectable} from '@angular/core';
import {fetchAuthSession, signIn, signOut, signUp} from 'aws-amplify/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

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
      console.log(e)
      this.isLoggedInSubject.next(false);
    }
  }

  async signUp(username: string, email: string, firstName: string, lastName: string, password: string) {
    const signUpOutput = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email: email,
          given_name: firstName,
          family_name: lastName
        }
      }
    });
    this.isLoggedInSubject.next(true);
    return signUpOutput;
  }

  async signIn(username: string, password: string) {
    const user = await signIn({username, password});
    this.isLoggedInSubject.next(true);
    return user;
  }

  async signOut() {
    try {
      await signOut();
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/welcome']);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  get isLoggedInValue(): boolean {
    return this.isLoggedInSubject.value;
  }
}
