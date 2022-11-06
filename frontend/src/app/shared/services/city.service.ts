import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';
import { URL_DB } from '../urls';
const URL_CITIES = `${URL_DB}/cities`;
@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}
  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(`${URL_CITIES}?_expand=country`);
  }
  getCitiesByCountryId(id: number): Observable<City[]> {
    return this.http.get<City[]>(
      `${URL_CITIES}?_expand=country&countryId=${id}`
    );
  }
}
