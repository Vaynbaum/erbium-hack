import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Specialization } from '../models/specialization.model';
import { University } from '../models/university.model';
import { URL_DB } from '../urls';
const URL_UNIVERSITIES = `${URL_DB}/universities`;
const URL_SPECIALTIES = `${URL_DB}/specialties`;

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  constructor(private http: HttpClient) {}

  getAllUniversities() {
    return this.http.get<University[]>(URL_UNIVERSITIES);
  }

  getAllSpecialization() {
    return this.http.get<Specialization[]>(URL_SPECIALTIES);
  }
}
