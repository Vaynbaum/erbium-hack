import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/shared/models/admin.model';
import { Input } from 'src/app/shared/models/input.model';
import { Message } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CODE, EMAIL, PASSWORD } from '../shared/const';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss', '../auth.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  title = 'Восстановление пароля';
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}
  code = '';
  firstFormGroup = new FormGroup({
    email: new FormControl(
      null,
      [Validators.required, Validators.email],
      this.forbiddenEmails.bind(this)
    ),
  });
  secondFormGroup = new FormGroup({
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
    code: new FormControl(null, [Validators.required]),
  });
  ngOnInit(): void {}
  message: Message = {
    text: '',
    type: '',
  };
  private showMessage(message: Message) {
    this.message = message;

    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }
  steps = [
    {
      form: this.firstFormGroup,
      label: 'Почта для отправки кода',
      nameButton: 'Отправить код',
      inputs: [
        {
          field: 'Email',
          messageError: () => {
            if (this.firstFormGroup?.get?.(EMAIL)?.['errors']?.['required']) {
              return 'Email не может быть пустым';
            }
            if (this.firstFormGroup?.get?.(EMAIL)?.['errors']?.[EMAIL]) {
              return 'Введите корректный email';
            }
            if (
              this.firstFormGroup?.get?.(EMAIL)?.['errors']?.['forbiddenEmail']
            ) {
              return 'Пользователя с таким email нет';
            }
            return '';
          },
          formControl: this.firstFormGroup.get(EMAIL),
          type: EMAIL,
        } as Input,
      ],
      handle: () => {
        this.code = this.randomString(8);
        const { email } = this.firstFormGroup.value;
        if (email) {
          this.userService
            .sendCodeRecoverPassword(email, this.code)
            .subscribe((res: any) => {
              if (!res.mailer_result || res.mailer_result != 'Success') {
                this.showMessage({
                  text: 'Не удалось отправить код',
                  type: 'danger',
                });
              }
            });
        }
      },
    },
    {
      form: this.secondFormGroup,
      label: 'Введите новый пароль',
      inputs: [
        {
          field: 'Код с почты',
          messageError: () => {
            return 'Код должен быть введён';
          },
          formControl: this.secondFormGroup.get(CODE),
          type: CODE,
        } as Input,
        {
          field: 'Новый пароль',
          messageError: () => {
            if (
              this.secondFormGroup?.get?.(PASSWORD)?.['errors']?.['required']
            ) {
              return 'Пароль не может быть пустым';
            }
            if (
              this.secondFormGroup?.get?.(PASSWORD)?.['errors']?.[
                'minlength'
              ] &&
              this.secondFormGroup?.get?.(PASSWORD)?.['errors']?.['minlength'][
                'requiredLength'
              ]
            )
              return `Пароль должен быть больше ${
                this.secondFormGroup.get(PASSWORD)?.['errors']?.['minlength']?.[
                  'requiredLength'
                ]
              } символов. Сейчас ${
                this.secondFormGroup.get(PASSWORD)?.['errors']?.['minlength']?.[
                  'actualLength'
                ]
              } символов`;
            return '';
          },
          formControl: this.secondFormGroup.get(PASSWORD),
          type: PASSWORD,
        } as Input,
      ],
      nameButton: 'Сохранить пароль',
      handle: () => {
        const { code, password } = this.secondFormGroup.value;
        const { email } = this.firstFormGroup.value;
        if (code && email && password && code == this.code) {
          let person = null;
          if (this.authService.admin) {
            this.authService.admin.password = password;
            person = this.authService.admin;
          } else if (this.authService.user) {
            this.authService.user.password = password;
            person = this.authService.user;
          }
          if (!person) {
            this.userService.getUserByEmail(email).subscribe((p) => {
              if (p) {
                person = User.of(p);
                person.password = password;
                this.updateUser(person);
              } else {
                this.adminService.getAdminByEmail(email).subscribe((p) => {
                  person = Admin.of(p);
                  person.password = password;
                  this.updateUser(person);
                });
              }
            });
          } else {
            this.updateUser(person);
          }
        } else {
          this.showMessage({
            text: 'Введен неверный код',
            type: 'danger',
          });
        }
      },
    },
  ];

  updateUser(person: any) {
    this.userService.changePassword(person.clone()).subscribe((user) => {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          canLogin: true,
        },
      });
    });
  }
  redirect() {
    this.router.navigate(['auth/login']);
  }
  randomString(i: number): string {
    var rnd = '';
    while (rnd.length < i) rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, i);
  }

  forbiddenEmails(control: AbstractControl): Promise<any> {
    return new Promise((resolve) => {
      this.userService.getUserByEmail(control.value).subscribe((user: User) => {
        if (user) {
          resolve(null);
        } else {
          this.adminService
            .getAdminByEmail(control.value)
            .subscribe((admin: Admin) => {
              if (admin) {
                resolve(null);
              } else {
                resolve({ forbiddenEmail: true });
              }
            });
        }
      });
    });
  }
}
