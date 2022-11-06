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
    { name: 'Лента', icon: 'cases', link: '/system/project-feed' },
    { name: 'Участники', icon: 'groups', link: '/system/participants' },
    {
      name: this.authService.admin ? 'Проекты' : 'Конкурсы',
      link: false,
      icon: 'emoji_events',
    },
  ];
  rightLinks = [
    {
      name: 'Уведомления',
      icon: 'notifications',
      link: false,
    },
  ];
  menu: boolean = false;

  accountLink = {
    name: 'Аккаунт',
    icon: 'account_circle',
    links: [
      {
        name: 'Профиль',
        link: this.authService.admin
          ? '/system/account_admin'
          : '/system/account_user',
      },
      {
        name: 'Проекты',
        link: this.authService.admin ? false : '/system/my-projects-list',
      },
      {
        name: 'Идеи',
        link: this.authService.admin ? false : '/system/ideas',
      },
    ],
  };
  account: boolean = false;

  ngOnInit(): void {}

  dropToggle() {
    this.menu = !this.menu;
  }

  accountToggle() {
    this.account = !this.account;
  }

  redirect(link: any) {
    if (link != false) {
      this.menu = false;
      this.router.navigate([link]);
    }
  }
}
