import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  topLinks = [
    { name: 'О нас' },
    { name: 'Партнеры' },
    { name: 'Положение' },
    { name: 'Сотрудничество' },
    { name: 'Контакты' },
  ];
  bottomLinks = [
    { name: 'Политика конфиденциальности' },
    { name: 'Пользовательское соглашение' },
  ];
  constructor() {}

  ngOnInit(): void {}
}
