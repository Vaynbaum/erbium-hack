import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TeamRoleUser } from 'src/app/shared/models/teamRoleUser.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TeamRole } from 'src/app/shared/models/teamRole.model';
import { RoleService } from 'src/app/shared/services/role.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Skill } from 'src/app/shared/models/skill.model';
import { SkillService } from 'src/app/shared/services/skill.service';
import { SkillUser } from 'src/app/shared/models/skillUser.model';
import {
  CITY,
  COUNTRY,
  EDUCATION,
  EMAIL,
  EMPLOYMENT,
  FIRSTNAME,
  LASTNAME,
  NATIOALITY,
  PATRONYMIC,
  PHONE,
  SPECIALIZATION,
  WORKEXPERIENCE,
  YEAR_GRADUATION,
} from 'src/app/auth/shared/const';
import { Input, SelectInput } from 'src/app/shared/models/input.model';
import { GENDERS } from 'src/app/shared/consts';
import { Country } from 'src/app/shared/models/country.model';
import { CountryService } from 'src/app/shared/services/country.service';
import { City } from 'src/app/shared/models/city.model';
import { CityService } from 'src/app/shared/services/city.service';
import { Admin } from 'src/app/shared/models/admin.model';
import { User } from 'src/app/shared/models/user.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UserService } from 'src/app/shared/services/user.service';
import { EducationService } from 'src/app/shared/services/education.service';
import { University } from 'src/app/shared/models/university.model';
import { Specialization } from 'src/app/shared/models/specialization.model';
import { Router } from '@angular/router';
import { EmploymentService } from 'src/app/shared/services/employment.service';
import { Employment } from 'src/app/shared/models/employment.model';
import { ThemePalette } from '@angular/material/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Company } from 'src/app/shared/models/company.model';
import { Education } from 'src/app/shared/models/education.model';
import { OWN_URL } from 'src/app/shared/urls';
enum Ind_Autocomp {
  COUNTRY,
  NATIOALITY,
  CITY,
}

enum IndEdu {
  EDU,
  SPEC,
}
@Component({
  selector: 'app-account-user',
  templateUrl: './account-user.component.html',
  styleUrls: [
    './account-user.component.scss',
    './account-user2.component.scss',
  ],
})
export class AccountUserComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private skillService: SkillService,
    private countryService: CountryService,
    private cityService: CityService,
    private userService: UserService,
    private adminService: AdminService,
    private router: Router,
    private educationService: EducationService,
    private employmentService: EmploymentService
  ) {}
  countries: Country[] = [];
  cities: City[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  user = this.authService.user;
  roleUser: TeamRoleUser[] = [];
  skillsUser: SkillUser[] = [];
  allRolesUserFiltered: Observable<any[]> | null = null;
  allRoleUser: TeamRole[] = [];
  allSkills: Skill[] = [];
  allSkillsFiltered: Observable<any[]> | null = null;
  @ViewChild('roleInput') roleInput: any;
  @ViewChild('skillInput') skillInput: any;
  teamRoleCtrl = new FormControl('');
  skillCtrl = new FormControl('');
  autocompletes: any[] = [];
  educations: SelectInput[] = [];
  genderFlag = this.user?.gender == GENDERS[0].name;
  universities: University[] = [];
  specializations: Specialization[] = [];
  employments: Employment[] = [];
  mainInfoFormGroup = new FormGroup({
    lastname: new FormControl(this.user?.lastname, [Validators.required]),
    firstname: new FormControl(this.user?.firstname, [Validators.required]),
    patronymic: new FormControl(this.user?.patronymic, [Validators.required]),
  });
  genderBirthFormGroup = new FormGroup({
    birthday: new FormControl(new Date(this.user?.birthday as number), [
      Validators.required,
    ]),
  });
  positionFormGroup = new FormGroup({
    country: new FormControl(this.user?.country?.name, [Validators.required]),
    city: new FormControl(this.user?.city?.name, [Validators.required]),
    nationality: new FormControl(this.user?.nationality?.name, [
      Validators.required,
    ]),
  });
  contactFormGroup = new FormGroup({
    phone: new FormControl(this.user?.phone, [Validators.required]),
    email: new FormControl(
      this.user?.email,
      [Validators.required, Validators.email],
      this.forbiddenEmails.bind(this)
    ),
  });
  educationFormGroup = new FormGroup({
    university: new FormControl(this.user?.education?.university?.name, [
      Validators.required,
    ]),
    specialization: new FormControl(
      this.user?.education?.specialization?.name,
      [Validators.required]
    ),
    yearGraduation: new FormControl(this.user?.education?.yearGraduation, [
      Validators.required,
      Validators.max(this.getCurrentYear()),
      Validators.min(1900),
    ]),
  });
  workFormGroup = new FormGroup({
    employment: new FormControl(this.user?.employment?.name, [
      Validators.required,
    ]),
    workExperience: new FormControl(this.calcYear(), [Validators.required]),
  });
  companyFormGroup = new FormGroup({
    name: new FormControl(this.user?.company?.name),
    uid: new FormControl(this.user?.company?.uid),
  });

  calcYear() {
    let now = new Date();
    if (this.user?.workExperience) {
      let date = new Date(this.user?.workExperience);
      return now.getFullYear() - date.getFullYear();
    } else {
      return 0;
    }
  }

  forbiddenEmails(control: AbstractControl): Promise<any> {
    return new Promise((resolve) => {
      this.userService.getUserByEmail(control.value).subscribe((user: User) => {
        if (user && user.email != this.user?.email) {
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

  yearGraduationInput: any = {
    field: YEAR_GRADUATION,
    formControl: this.educationFormGroup.get(YEAR_GRADUATION),
    type: 'number',
    label: 'Дата окончания',
    icon: 'event',
    messageError: () => {
      if (
        this.educationFormGroup?.get?.(YEAR_GRADUATION)?.['errors']?.['min']
      ) {
        return 'Год меньше минимального';
      } else if (
        this.educationFormGroup?.get?.(YEAR_GRADUATION)?.['errors']?.['max']
      ) {
        return 'Год больше максимального';
      }
      return 'Год должен быть указан';
    },
  };

  contacts: any[] = [
    {
      field: EMAIL,
      type: EMAIL,
      label: 'Email',
      icon: 'email',
      placeholder: 'Введите электронную почту...',
      messageError: () => {
        if (this.contactFormGroup?.get?.(EMAIL)?.['errors']?.['required']) {
          return 'Email не может быть пустым';
        }
        if (this.contactFormGroup?.get?.(EMAIL)?.['errors']?.[EMAIL]) {
          return 'Введите корректный email';
        }
        if (
          this.contactFormGroup?.get?.(EMAIL)?.['errors']?.['forbiddenEmail']
        ) {
          return 'Email уже занят';
        }
        return '';
      },
      formControl: this.contactFormGroup?.get?.(EMAIL),
    },
    {
      field: PHONE,
      type: 'tel',
      label: 'Телефон',
      placeholder: 'Введите Ваш номер телефона...',
      icon: 'phone_enabled',
      formControl: this.contactFormGroup.get(PHONE),
      messageError: () => {
        return 'Телефон должен быть указан';
      },
    },
  ];

  inputs: Input[] = [
    {
      field: LASTNAME,
      placeholder: 'Введите фамилию...',
      type: 'name',
      label: 'Фамилия',
      icon: 'badge',
      messageError: () => {
        return 'Поле фамилия должно быть заполнено';
      },
      formControl: this.mainInfoFormGroup.get(LASTNAME),
    },
    {
      field: FIRSTNAME,
      placeholder: 'Введите имя...',
      type: 'name',
      label: 'Имя',
      icon: 'person',
      messageError: () => {
        return 'Поле имя должно быть заполнено';
      },
      formControl: this.mainInfoFormGroup.get(FIRSTNAME),
    },
    {
      field: PATRONYMIC,
      placeholder: 'Введите отчество...',
      type: 'name',
      label: 'Отчество',
      icon: 'assignment_ind',
      messageError: () => {
        return 'Поле отчество должно быть заполнено';
      },
      formControl: this.mainInfoFormGroup.get(PATRONYMIC),
    },
  ];

  removeRole(role: TeamRoleUser) {
    const index = this.roleUser.indexOf(role);
    if (index >= 0) {
      this.authService.deleteRole(index);
      this.roleService.deleteRoleFromUser(role.id).subscribe(() => {});
    }
  }
  removePatent(patent: string) {
    const index = this.user?.patents?.indexOf(patent);
    if (index != undefined && index >= 0) {
      this.user?.patents?.splice(index, 1);
    }
  }

  removeSkill(skill: SkillUser) {
    const index = this.skillsUser.indexOf(skill);
    if (index >= 0) {
      this.authService.deleteSkill(index);
      this.skillService.deleteSkillFromUser(skill.id).subscribe(() => {});
    }
  }

  compile_values(arr: any[], form: any) {
    return form.valueChanges.pipe(
      startWith(null),
      map((item: any) => (item ? this._filterValues(item, arr) : arr.slice()))
    );
  }
  private _filterValues(value: string, values: any[]) {
    const filterValue = value.toLowerCase();
    return values.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  logout() {
    this.router.navigate(['/auth/login']);
    this.authService.Logout();
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.user?.patents?.push(value);
    }
    event.chipInput!.clear();
  }
  deleteUser() {
    this.userService.deleteUser(this.user?.id as number).subscribe(() => {
      window.localStorage.clear();
      this.router.navigate(['/auth/login'], {
        queryParams: {
          deleteUser: true,
        },
      });
    });
  }

  saveData() {
    const { lastname, firstname, patronymic } = this.mainInfoFormGroup.value;
    const { birthday } = this.genderBirthFormGroup.value;
    const { country, city, nationality } = this.positionFormGroup.value;
    const { phone, email } = this.contactFormGroup.value;
    const { university, specialization, yearGraduation } =
      this.educationFormGroup.value;
    const { employment, workExperience } = this.workFormGroup.value;
    const { name, uid } = this.companyFormGroup.value;
    const nameCompany = name;
    const uidCompany = uid;

    let countryId = this.countries.find((c) => c.name === country)?.id;
    let cityId = this.cities.find((c) => c.name === city)?.id;
    let employmentId = this.employments.find((e) => e.name === employment)?.id;
    let nat = this.countries.find((c) => c.name === nationality);

    let now = new Date();
    now.setFullYear(
      //@ts-ignore
      now.getFullYear() - workExperience
    );
    let uni = this.universities.find((u) => u.name == university);
    let spec = this.specializations.find((s) => s.name == specialization);

    if (countryId && cityId) {
      let user = new User(
        email as string,
        this.user?.password as string,
        lastname as string,
        firstname as string,
        patronymic as string,
        countryId,
        cityId,
        nat as Country,
        this.genderFlag ? GENDERS[0].name : GENDERS[1].name,
        phone as string,
        this.user?.roleId as number,
        this.user?.url,
        employmentId,
        now.getTime(),
        this.user?.achievement,
        this.user?.patents,
        nameCompany && uidCompany ? new Company(nameCompany, uidCompany) : null,
        //@ts-ignore
        new Education(uni, spec, yearGraduation),
        this.user?.id,
        birthday?.getTime()
      );

      this.userService.updateUser(user).subscribe((user) => {
        this.userService
          .authUser(user.email, true, true, true, true)
          .subscribe((user) => {
            this.authService.Login(user);
            this.user = user;
          });
      });
    }
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    let skill = this.allSkills.find((skill) => skill.name == value);
    if (skill) {
      const res = this.skillsUser.find((s) => s.skill?.id == skill?.id);
      if (!res && this.user) {
        //@ts-ignore
        let s = new SkillUser(this.user.id, skill.id);
        //@ts-ignore
        let s_display = new SkillUser(this.user.id, skill.id, skill);
        this.authService.addSkill(s_display);
        this.skillService.addSkillToUser(s).subscribe((skill: any) => {
          let ind = this.skillsUser.length - 1;
          s = this.skillsUser[ind];
          s.id = skill.id;
          this.authService.updateSkill(ind, s);
        });
      }
    }
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  selectedRole(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    let role = this.allRoleUser.find((role) => role.name == value);
    if (role) {
      const res = this.roleUser.find((r) => r.teamRoleId == role?.id);
      if (!res && this.user) {
        //@ts-ignore
        let r = new TeamRoleUser(this.user.id, role.id);
        //@ts-ignore
        let r_display = new TeamRoleUser(this.user.id, role.id, role);
        this.authService.addRole(r_display);
        this.roleService.addRoleToUser(r).subscribe((role) => {
          let ind = this.roleUser.length - 1;
          r = this.roleUser[ind];
          r.id = role.id;
          this.authService.updateRole(ind, r);
        });
      }
    }
    this.roleInput.nativeElement.value = '';
    this.teamRoleCtrl.setValue(null);
  }

  compileUrl(url: any) {
    if (url.indexOf('http') >= 0) return url;
    else return `${OWN_URL}/${url}`;
  }

  onSelectCountry(input: any, value: any) {
    if (input == COUNTRY) {
      this.cityService.getCitiesByCountryId(value.id).subscribe((cities) => {
        this.cities = cities as City[];
        this.autocompletes[Ind_Autocomp.CITY].values = this.compile_values(
          this.cities,
          this.positionFormGroup.get(CITY)
        );
      });
    }
  }

  toggle(flag: boolean) {
    this.genderFlag = flag;
  }
  workAuto: any = {
    icon: 'work',
    field: EMPLOYMENT,
    placeholder: 'Занятость...',
    type: 'text',
    label: 'Укажите Вашу занятость',
    formControl: this.workFormGroup.get(EMPLOYMENT),
    messageError: () => {
      return 'Занятость должна быть указана';
    },
  };
  workYearInput: any = {
    field: WORKEXPERIENCE,
    placeholder: 'Введите Ваш опыт работы...',
    formControl: this.workFormGroup.get(WORKEXPERIENCE),
    type: 'number',
    label: 'Какой у Вас опыт работы (в годах)?',
    icon: 'star',
    messageError: () => {
      return 'Год должен быть указан';
    },
  };
  getCurrentYear() {
    return new Date().getFullYear() + 6;
  }

  xac1 = [
    {
      field: '',
      placeholder: 'Укажите опыт...',
      type: 'text',
      label: 'Какой у Вас опыт участия в хакатонах?',
      icon: 'stars',
    },
    {
      field: '',
      placeholder: 'Прикрепите файл с Вашим резюме',
      type: 'text',
      label: 'Прикрепить резюме',
      icon: 'attach_file',
    },
  ];
  xac2 = [
    {
      field: '',
      placeholder: 'Укажите название...',
      type: 'text',
      label: 'Название конкурса',
      icon: 'groups',
    },
    {
      field: '',
      placeholder: 'Укажите степень...',
      type: 'text',
      label: 'Какую степень Вы заняли?',
      icon: 'emoji_events',
    },
  ];

  novMoscow1 = [
    {
      field: '',
      placeholder: 'Введите ИНН...',
      type: 'text',
      label: 'Укажите Ваш ИНН',
      icon: 'verified',
    },
    {
      field: '',
      placeholder: 'Введите Ваш адрес места жительства...',
      type: 'text',
      label: 'Адрес места жительства (прописка)',
      icon: 'apartment',
    },
  ];
  novMoscow2 = [
    {
      field: '',
      placeholder: 'Введите название программы участия...',
      type: 'text',
      icon: 'science',
    },
    {
      field: '',
      placeholder: 'Сумма гранта...',
      type: 'number',
      icon: 'currency_ruble',
    },
  ];

  work: any[] = [
    {
      placeholder: 'Введите название компании...',
      type: 'text',
      icon: 'store',
      form: this.companyFormGroup.get('name'),
    },
    {
      placeholder: 'Введите ИНН компании...',
      type: 'text',
      icon: 'pin',
      form: this.companyFormGroup.get('uid'),
    },
  ];

  ngOnInit(): void {
    this.roleUser = this.authService.roleUser;
    this.skillsUser = this.authService.skillsUser;
    this.roleService.getAllTeamRoles().subscribe((roles) => {
      this.allRoleUser = roles;
      this.allRolesUserFiltered = this.compile_values(roles, this.teamRoleCtrl);
    });
    this.skillService.getAllSkills().subscribe((skills) => {
      this.allSkills = skills;
      this.allSkillsFiltered = this.compile_values(skills, this.skillCtrl);
    });

    this.countryService.getAllCountries().subscribe((items) => {
      this.countries = items as Country[];
      (this.autocompletes[Ind_Autocomp.COUNTRY] = {
        placeholder: 'Выберите страну...',
        field: COUNTRY,
        type: 'text',
        label: 'Страна',
        icon: 'flag',
        messageError: () => {
          return 'Страна должна быть указана';
        },
        formControl: this.positionFormGroup.get(COUNTRY),
        values: this.compile_values(
          this.countries,
          this.positionFormGroup.get(COUNTRY)
        ),
      }),
        (this.autocompletes[Ind_Autocomp.NATIOALITY] = {
          placeholder: 'Выберите гражданство...',
          field: NATIOALITY,
          type: 'text',
          label: 'Гражданство',
          icon: 'flag',
          messageError: () => {
            return 'Гражданство должно быть указано';
          },
          formControl: this.positionFormGroup.get(NATIOALITY),
          values: this.compile_values(
            this.countries,
            this.positionFormGroup.get(NATIOALITY)
          ),
        });
      this.autocompletes[Ind_Autocomp.CITY] = {
        placeholder: 'Выберите город...',
        field: CITY,
        type: 'text',
        label: 'Город',
        icon: 'location_city',
        messageError: () => {
          return 'Город должен быть указан';
        },
        formControl: this.positionFormGroup.get(CITY),
        values: this.compile_values(
          this.cities,
          this.positionFormGroup.get(CITY)
        ),
      };
      this.cityService //@ts-ignore
        .getCitiesByCountryId(this.user?.country?.id)
        .subscribe((cities) => {
          this.cities = cities as City[];
          this.autocompletes[Ind_Autocomp.CITY].values = this.compile_values(
            this.cities,
            this.positionFormGroup.get(CITY)
          );
        });
    });

    this.educationService.getAllUniversities().subscribe((universities) => {
      this.universities = universities as University[];
      this.educations[IndEdu.EDU] = {
        field: EDUCATION,
        type: 'text',
        label: 'Ваш ВУЗ',
        icon: 'school',
        messageError: () => {
          return 'ВУЗ должен быть указан';
        },
        formControl: this.educationFormGroup.get(EDUCATION),
        values: this.compile_values(
          this.universities,
          this.educationFormGroup.get(EDUCATION)
        ),
      };
    });
    this.educationService
      .getAllSpecialization()
      .subscribe((specializations) => {
        this.specializations = specializations as Specialization[];
        this.educations[IndEdu.SPEC] = {
          field: SPECIALIZATION,
          type: 'text',
          label: 'Ваша специальность',
          icon: 'home_repair_service',
          messageError: () => {
            return 'Специальность должна быть указана';
          },
          formControl: this.educationFormGroup.get(SPECIALIZATION),
          values: this.compile_values(
            this.specializations,
            this.educationFormGroup.get(SPECIALIZATION)
          ),
        };
      });

    this.employmentService.getAllEmployments().subscribe((employments) => {
      this.employments = employments;
      this.workAuto.values = this.compile_values(
        this.employments,
        this.workFormGroup.get(EMPLOYMENT)
      );
    });
  }
}
