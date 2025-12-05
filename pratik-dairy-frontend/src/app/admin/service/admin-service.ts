  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';


  export interface User{
    id: number;
    firstName : string;
    LastName : string;
    email : string;
    username: string;
    role : string;
    
  }


  @Injectable({
    providedIn: 'root'
  })
  export class AdminService {
    
    private apiUrl = "http://localhost:8081/admin/findAll";

    constructor(private http : HttpClient){}

    getAllUsers() : Observable<User[]>{
      return this.http.get<User[]>(this.apiUrl);
    }

  }
