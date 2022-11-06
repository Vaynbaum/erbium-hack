import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Admin } from '../models/admin.model';
import { URL_DB } from '../urls';
const URL_ADMINS = `${URL_DB}/admins`;
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}
  authAdmin(email: any, role?: boolean): Observable<Admin> {
    return this.http
      .get<Admin>(`${URL_ADMINS}?email=${email}${role ? '&_expand=role' : ''}`)
      .pipe(map((admins: any) => (admins[0] ? admins[0] : undefined)));
  }

  getAdminByEmail(email: string): Observable<Admin> {
    return this.http
      .get<Admin>(`${URL_ADMINS}?email=${email}`)
      .pipe(map((admin: any) => (admin[0] ? admin[0] : undefined)));
  }
}
