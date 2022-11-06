import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employment } from '../models/employment.model';
import { URL_DB } from '../urls';
const URL_EMPLOYMENTS = `${URL_DB}/employments`;
@Injectable({
  providedIn: 'root',
})
export class EmploymentService {
  getAllEmployments(): Observable<Employment[]> {
    return this.http.get<Employment[]>(URL_EMPLOYMENTS);
  }
  constructor(private http: HttpClient) {}
}
