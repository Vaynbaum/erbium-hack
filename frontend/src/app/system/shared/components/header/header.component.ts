import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  leftLinks = [
    { name: 'Лента', icon: 'cases', hide: true, link: '/system/project-feed' },
    {
      name: 'Участники',
      icon: 'groups',
      hide: true,
      link: '/system/participants',
    },
    {
      name: this.authService.admin ? 'Проекты' : 'Конкурсы',
      hide: true,
      link: false,
      icon: 'emoji_events',
    },
  ];
  rightLinks = [
    {
      name: 'Уведомления',
      icon: 'notifications',
      hide: true,
      link: false,
    },
  ];
  menu: boolean = false;

  accountLink: any;
  account: boolean = false;

  ngOnInit(): void {
    if (this.authService.admin) {
      this.accountLink = {
        name: 'Аккаунт',
        icon: 'account_circle',
        links: [
          {
            name: 'Профиль',
            link: this.authService.admin
              ? '/system/account_admin'
              : '/system/account_user',
            hide: true,
          },
          {
            name: 'Выход',
            link: '/auth/login',
            hide: true,
          },
        ],
      };
    }
    else {
      this.accountLink = {
        name: 'Аккаунт',
        icon: 'account_circle',
        links: [
          {
            name: 'Профиль',
            link: this.authService.admin
              ? '/system/account_admin'
              : '/system/account_user',
            hide: true,
          },
          {
            name: 'Проекты',
            link: '/system/my-projects-list',
            hide: this.authService.admin ? false : true,
          },
          {
            name: 'Идеи',
            link: '/system/ideas',
            hide: this.authService.admin ? false : true,
          },
          {
            name: 'Выход',
            link: '/auth/login',
            hide: true,
          },
        ],
      };
    }
  }

  dropToggle() {
    this.menu = !this.menu;
  }

  accountToggle() {
    this.account = !this.account;
  }

  redirect(link: any) {
    console.log(link);
    if (link.link && link.hide) {
      if (link.name == 'Выход') {
        this.authService.Logout();
      }
      this.menu = false;
      this.router.navigate([link.link]);
    }
  }

  feed() {
    this.router.navigate(['/system/main']);
    // this.authService.Logout();
  }
}
