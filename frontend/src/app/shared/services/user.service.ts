import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_DB, URL_MAILER } from '../urls';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

const URL_USERS = `${URL_DB}/users`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }
  getUserByEmail(email: any): Observable<User> {
    return this.http
      .get<User>(`${URL_USERS}?email=${email}`)
      .pipe(map((user: any) => (user[0] ? user[0] : undefined)));
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${URL_USERS}/${id}`);
  }
  createUser(user: User): Observable<User> {
    return this.http.post<User>(URL_USERS, user);
  }

  greetingMail(email: string, password: string) {
    return this.http.get(`${URL_MAILER}/greeting/`, {
      params: { email: email, password: password },
    });
  }
  deleteUser(id: number) {
    return this.http.delete(`${URL_USERS}/${id}`);
  }

  changePassword(user: User): Observable<User> {
    return this.http.put<User>(`${URL_USERS}/${user.id}`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${URL_USERS}/${user.id}`, user);
  }

  sendCodeRecoverPassword(email: string, code: string) {
    return this.http.get(`${URL_MAILER}/send_code/`, {
      params: { email: email, code: code },
    });
  }

  authUser(
    email: any,
    country?: boolean,
    city?: boolean,
    role?: boolean,
    employment?: boolean
  ): Observable<User> {
    return this.http
      .get<User>(
        `${URL_USERS}?email=${email}${country ? '&_expand=country' : ''}${city ? '&_expand=city' : ''
        }${employment ? '&_expand=employment' : ''}${role ? '&_expand=role' : ''
        }`
      )
      .pipe(map((user: any) => (user[0] ? user[0] : undefined)));
  }

  getAllParticipants(): Observable<User[]> {
    return this.http.get<User[]>(
      `${URL_USERS}?_expand=city`
      )
  }
}
