import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { GENDERS, USER } from 'src/app/shared/consts';
import { Admin } from 'src/app/shared/models/admin.model';
import { City } from 'src/app/shared/models/city.model';
import { Country } from 'src/app/shared/models/country.model';
import { Input, SelectInput } from 'src/app/shared/models/input.model';
import { Role } from 'src/app/shared/models/role.model';
import { User } from 'src/app/shared/models/user.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { CityService } from 'src/app/shared/services/city.service';
import { CountryService } from 'src/app/shared/services/country.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { UserService } from 'src/app/shared/services/user.service';
import {
  CITY,
  COUNTRY,
  EMAIL,
  FIRSTNAME,
  GENDER,
  LASTNAME,
  NATIOALITY,
  PASSWORD,
  PATRONYMIC,
  PHONE,
} from '../shared/const';

enum Ind_Autocomp {
  GENDER,
  COUNTRY,
  CITY,
  NATIOALITY,
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss', '../auth.component.scss'],
})
export class RegistrationComponent implements OnInit {
  title = 'Регистрация';
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private countryService: CountryService,
    private cityService: CityService,
    private router: Router,
    private roleService: RoleService
  ) {}
  countries: Country[] = [];
  cities: City[] = [];
  roleUser: Role | null = null;
  form: FormGroup = new FormGroup({
    email: new FormControl(
      null,
      [Validators.required, Validators.email],
      this.forbiddenEmails.bind(this)
    ),
    lastname: new FormControl(null, [Validators.required]),
    firstname: new FormControl(null, [Validators.required]),
    patronymic: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    nationality: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  inputs: Input[] = [
    {
      field: LASTNAME,
      type: 'name',
      label: 'Фамилия',
      icon: 'badge',
      messageError: () => {
        return 'Поле фамилия должно быть заполнено';
      },
      formControl: this.form.get(LASTNAME),
    },
    {
      field: FIRSTNAME,
      type: 'name',
      label: 'Имя',
      icon: 'person',
      messageError: () => {
        return 'Поле имя должно быть заполнено';
      },
      formControl: this.form.get(FIRSTNAME),
    },
    {
      field: PATRONYMIC,
      type: 'name',
      label: 'Отчество',
      icon: 'assignment_ind',
      messageError: () => {
        return 'Поле отчество должно быть заполнено';
      },
      formControl: this.form.get(PATRONYMIC),
    },
    {
      field: EMAIL,
      type: EMAIL,
      label: 'Email',
      icon: 'email',
      placeholder: 'pat@example.com',
      messageError: () => {
        if (this.form?.get?.(EMAIL)?.['errors']?.['required']) {
          return 'Email не может быть пустым';
        }
        if (this.form?.get?.(EMAIL)?.['errors']?.[EMAIL]) {
          return 'Введите корректный email';
        }
        if (this.form?.get?.(EMAIL)?.['errors']?.['forbiddenEmail']) {
          return 'Email уже занят';
        }
        return '';
      },
      formControl: this.form?.get?.(EMAIL),
    },
    {
      field: PASSWORD,
      type: PASSWORD,
      label: 'Пароль',
      hide: true,
      messageError: () => {
        if (this.form?.get?.(PASSWORD)?.['errors']?.['required']) {
          return 'Пароль не может быть пустым';
        }
        if (
          this.form?.get?.(PASSWORD)?.['errors']?.['minlength'] &&
          this.form?.get?.(PASSWORD)?.['errors']?.['minlength'][
            'requiredLength'
          ]
        )
          return `Пароль должен быть больше ${
            this.form.get(PASSWORD)?.['errors']?.['minlength']?.[
              'requiredLength'
            ]
          } символов. Сейчас ${
            this.form.get(PASSWORD)?.['errors']?.['minlength']?.['actualLength']
          } символов`;
        return '';
      },
      formControl: this.form?.get?.(PASSWORD),
    },
    {
      field: PHONE,
      type: 'tel',
      label: 'Телефон',
      icon: 'phone_enabled',
      formControl: this.form.get(PHONE),
      messageError: () => {
        return 'Телефон должен быть указан';
      },
    },
  ];

  autocompletes: SelectInput[] = [];
  private _filterValues(value: string, values: any[]) {
    const filterValue = value.toLowerCase();
    return values.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  ngOnInit(): void {
    this.roleService.getRoleByName(USER).subscribe((role) => {
      this.roleUser = role;
    });
    this.countryService.getAllCountries().subscribe((items) => {
      this.countries = items as Country[];
      (this.autocompletes[Ind_Autocomp.GENDER] = {
        field: GENDER,
        type: 'text',
        label: 'Пол',
        icon: 'man',
        messageError: () => {
          return 'Пол должен быть указан';
        },
        formControl: this.form.get(GENDER),
        values: this.compile_values(GENDER, GENDERS),
      }),
        (this.autocompletes[Ind_Autocomp.COUNTRY] = {
          field: COUNTRY,
          type: 'text',
          label: 'Страна',
          icon: 'flag',
          messageError: () => {
            return 'Страна должна быть указана';
          },
          formControl: this.form.get(COUNTRY),
          values: this.compile_values(COUNTRY, this.countries),
        }),
        (this.autocompletes[Ind_Autocomp.CITY] = {
          field: CITY,
          type: 'text',
          label: 'Город',
          icon: 'location_city',
          messageError: () => {
            return 'Город должен быть указан';
          },
          formControl: this.form.get(CITY),
          values: this.compile_values(CITY, this.cities),
        }),
        (this.autocompletes[Ind_Autocomp.NATIOALITY] = {
          field: NATIOALITY,
          type: 'text',
          label: 'Гражданство',
          icon: 'flag',
          messageError: () => {
            return 'Гражданство должно быть указано';
          },
          formControl: this.form.get(NATIOALITY),
          values: this.compile_values(NATIOALITY, this.countries),
        });
    });
  }

  compile_values(name: string, arr: any[]) {
    return this.form.get(name)?.valueChanges.pipe(
      startWith(''),
      map((item) => (item ? this._filterValues(item, arr) : arr.slice()))
    );
  }

  forbiddenEmails(control: AbstractControl): Promise<any> {
    return new Promise((resolve) => {
      this.userService.getUserByEmail(control.value).subscribe((user: User) => {
        if (user) {
          resolve({ forbiddenEmail: true });
        } else {
          this.adminService
            .getAdminByEmail(control.value)
            .subscribe((admin: Admin) => {
              if (admin) {
                resolve({ forbiddenEmail: true });
              } else {
                resolve(null);
              }
            });
        }
      });
    });
  }
  redirect() {
    this.router.navigate(['auth/login']);
  }
  onSubmit() {
    const {
      email,
      city,
      nationality,
      gender,
      phone,
      patronymic,
      country,
      lastname,
      firstname,
      password,
    } = this.form.value;
    let countryId = this.countries.find((c) => c.name == country)?.id;
    let cityId = this.cities.find((c) => c.name == city)?.id;
    let nat = this.countries.find((c) => c.name == nationality);
    console.log(GENDERS.find((item) => item.name == gender));
    if (countryId && cityId && nat) {
      const user = new User(
        email,
        password,
        lastname,
        firstname,
        patronymic,
        countryId,
        cityId,
        nat,
        gender,
        phone,
        this.roleUser?.id as number,
        //@ts-ignore
        `${GENDERS.find((item) => item.name == gender)?.id}_${
          Math.floor(Math.random() * 1) + 1
        }.png`,
      );
      this.userService.createUser(user).subscribe(() => {
        this.userService.greetingMail(email, password).subscribe(
          (res) => {
            console.log(res);
          },
          (res) => {
            console.error(res);
          }
        );
        this.router.navigate(['/auth/login'], {
          queryParams: {
            canLogin: true,
          },
        });
      });
    }
  }

  onSelectCountry(input: any, value: any) {
    if (input == COUNTRY) {
      this.cityService.getCitiesByCountryId(value.id).subscribe((cities) => {
        this.cities = cities as City[];
        this.autocompletes[Ind_Autocomp.CITY].values = this.compile_values(
          CITY,
          this.cities
        );
      });
    }
  }
}
