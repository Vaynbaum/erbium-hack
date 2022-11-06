import { City } from './city.model';

export class University {
  static of(obj: any) {
    return new University(
      obj.name ?? '',
      obj.cityId ?? 0,
      obj.city ? City.of(obj.city) : null,
      obj.id ?? 0
    );
  }
  constructor(
    public name: string,
    public cityId: number,
    public city?: City | null,
    public id?: number
  ) {}
}
