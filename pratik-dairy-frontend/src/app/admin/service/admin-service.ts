import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { UserDto } from '../../model';

export type { UserDto };

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiBaseUrl}/users/admin/findAll`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }
}