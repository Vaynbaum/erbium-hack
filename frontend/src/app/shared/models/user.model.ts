import { City } from './city.model';
import { Company } from './company.model';
import { Country } from './country.model';
import { Education } from './education.model';
import { Employment } from './employment.model';

import { Role } from './role.model';

export class User {
  static of(obj: any): User {
    return new User(
      obj.email ?? '',
      obj.password ?? '',
      obj.lastname ?? '',
      obj.firstname ?? '',
      obj.patronymic ?? '',
      obj.countryId ?? 0,
      obj.cityId ?? 0,
      obj.nationality ? Country.of(obj.nationality) : null,
      obj.gender ?? '',
      obj.phone ?? '',
      obj.roleId ?? 0,
      obj.url ?? '',
      obj.employmentId ?? 0,
      obj.workExperience ?? 0,
      obj.achievement ?? '',
      obj.patents ?? [],
      obj.company ? Company.of(obj.company) : null,
      obj.education ? Education.of(obj.education) : null,
      obj.id ?? 0,
      obj.birthday ?? 0,
      obj.country ? Country.of(obj.country) : null,
      obj.city ? City.of(obj.city) : null,
      obj.employment ? Employment.of(obj.employment) : null,
      obj.role ? Role.of(obj.role) : null
    );
  }

  constructor(
    public email: string,
    public password: string,
    public lastname: string,
    public firstname: string,
    public patronymic: string,
    public countryId: number,
    public cityId: number,
    public nationality: Country | null,
    public gender: string,
    public phone: string,
    public roleId: number,
    public url?: string,
    public employmentId?: number,
    public workExperience?: number,
    public achievement?: string,
    public patents?: string[],
    public company?: Company | null,
    public education?: Education | null,
    public id?: number,
    public birthday?: number,
    public country?: Country | null,
    public city?: City | null,
    public employment?: Employment | null,
    public role?: Role | null
  ) {}
}
