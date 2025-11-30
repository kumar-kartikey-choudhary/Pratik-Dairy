import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';


interface SignUp{
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  password: string;
}

interface UserDto{
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;

}

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private readonly SIGNUP_URL = 'http://localhost:8081';

  constructor(private http : HttpClient){}

  /**
   * Sends register/signup credentials to the Spring Boot backend.
   * @param credentials - Object containing register fields.
   * @returns - userDto 
   */
  onSignUp(credentials : SignUp) : Observable<UserDto>{
    const url = `${this.SIGNUP_URL}/auth/register`;
    return this.http.post<UserDto>(url, credentials).pipe(
      tap(() =>{
        console.log(`Registration request sent for ${credentials.username}`);
      })
    );
  }
  
}
