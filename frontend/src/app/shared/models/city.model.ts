import { Country } from './country.model';

export class City {
  static of(obj: any) {
    return new City(
      obj.name ?? '',
      obj.countryId ?? 0,
      obj.country ? Country.of(obj.country) : null,
      obj.id ?? 0
    );
  }
  constructor(
    public name: string,
    public countryId: number,
    public country?: Country | null,
    public id?: number
  ) {}
}
