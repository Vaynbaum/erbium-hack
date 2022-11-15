import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Admin } from 'src/app/shared/models/admin.model';
import { Input } from 'src/app/shared/models/input.model';
import { Message } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { EMAIL, PASSWORD } from '../shared/const';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth.component.scss'],
})
export class LoginComponent implements OnInit {
  title = 'Авторизация';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UserService,
    private adminService: AdminService,
    private authService: AuthService
  ) {}
  welcome = false;
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
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
  ngOnInit(): void {
    this.message = new Message('danger', '');
    this.route.queryParams.subscribe((params: Params) => {
      if (params['canLogin']) {
        this.welcome = true;
        this.showMessage({
          text: 'Теперь вы можете зайти в систему',
          type: 'success',
        });
      } else if (params['deleteUser']) {
        this.showMessage({
          text: 'Ваш аккаунт успешно удалён',
          type: 'success',
        });
      } else if (params['accessDenied']) {
        this.showMessage({
          text: 'Авторизуйтесь чтобы попасть в систему',
          type: 'warning',
        });
      }
    });
  }
  inputs: Input[] = [
    {
      field: EMAIL,
      type: EMAIL,
      icon: 'email',
      label: 'Email',
      placeholder: 'pat@example.com',
      messageError: () => {
        if (this.form?.get?.(EMAIL)?.['errors']?.['required']) {
          return 'Email не может быть пустым';
        }
        if (this.form?.get?.(EMAIL)?.['errors']?.[EMAIL]) {
          return 'Введите корректный email';
        }
        return '';
      },
      formControl: this.form?.get?.(EMAIL),
    },
    {
      field: PASSWORD,
      type: PASSWORD,
      label: 'Введите пароль',
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
  ];
  redirect(link: string) {
    this.router.navigate([link]);
  }
  onSubmit() {
    const { email, password } = this.form.value;
    this.usersService.getUserByEmail(email).subscribe((u) => {
      if (u) {
        this.usersService
          .authUser(email, true, true, true, u.employmentId ? true : false)
          .subscribe((user: User) => {
            if (user) {
              if (user.password == (password as any)) {
                this.authService.Login(user);
                this.router.navigate(['/system/main']);
              } else {
                this.showMessage({
                  text: 'Пароль не верный',
                  type: 'danger',
                });
              }
            }
          });
      } else {
        this.adminService.authAdmin(email, true).subscribe((admin: Admin) => {
          if (admin) {
            if (admin.password == (password as any)) {
              this.authService.Login(admin);
              this.router.navigate(['/system/account_admin'], {});
            } else {
              this.showMessage({
                text: 'Пароль не верный',
                type: 'danger',
              });
            }
          } else {
            this.showMessage({
              text: 'Такого пользователя не существует',
              type: 'danger',
            });
          }
        });
      }
    });
  }
}
