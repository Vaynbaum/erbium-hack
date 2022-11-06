import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { URL_DB } from '../urls';
const URL_COUNTRIES = `${URL_DB}/countries`;
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}
  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(URL_COUNTRIES)
  }
}
