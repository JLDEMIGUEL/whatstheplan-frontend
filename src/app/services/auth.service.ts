import { Injectable } from '@angular/core';
import { signUp, signIn, signOut } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  async signUp(username: string, email: string, firstName: string, lastName: string, password: string) {
    return await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
          given_name: firstName,
          family_name: lastName
        }
      }
    });
  }

  async signIn(username: string, password: string) {
    return await signIn({ username, password });
  }

  async signOut() {
    return await signOut();
  }
}
