import { Component, OnInit } from '@angular/core';
import { GoogleChart } from 'src/app/shared/models/googleCharts.model';
import { ChartType } from 'angular-google-charts';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.scss'],
})
export class AccountAdminComponent implements OnInit {
  titleTextStyle = {
    // color: '#bd4330',
    italic: false,
    fontSize: 18,
    bold: true,
  };
  chart: GoogleChart = {
    type: 'BubbleChart' as ChartType,
    columns: [
      'Код проекта',
      'Актуальность проекта',
      'Стоимость проекта',
      'Стадия проекта',
      'Численость команды',
    ],
    opt: {
      width: 1000,
      height: 400,
      hAxis: {
        title: 'Актуальность проекта',
        titleTextStyle: this.titleTextStyle,
      },

      vAxis: {
        title: 'Стоимость проекта',
        titleTextStyle: this.titleTextStyle,
      },

      bubble: {
        textStyle: {
          auraColor: 'none',
          fontSize: 14,
        },
        opacity: 0.5,
      },
      explorer: {
        action: ['dragToPan', 'rightClickToReset'],
      },

      chartArea: {
        height: 320,
        width: 800,
        top: 5,
      },
    },

    data: [],
  };
  myControl: any;
  data = [
    {
      tag: 'Образование',
      values: [
        ['Мобильное приложение "Ученик"', 4, 100000, 'Проект', 5],
        ['Веб-сервис "Оценка компитенций"', 3, 1000000, 'Проект', 7],
        ['Рекомендательная система по изучению языков', 6, 350000, 'Проект', 2],
        ['Мобильное приложение "Профориентация"', 7, 200000, 'Идея', 3],
      ],
    },
    {
      tag: 'Здоровье',
      values: [
        ['Умное расписание «Контроль здоровья»', 1, 50000, 'Идея', 3],
        ['Фитнес-приложение «Движение»', 4, 400000, 'Проект', 4],
        [
          'Устройства мониторинга температуры тела пассажиров в аэропортах',
          6,
          500000,
          'Проект',
          8,
        ],
        ['Контроль производственных помещений', 2, 100000, 'Идея', 2],
      ],
    },
    {
      tag: 'Бизнес-инструменты',
      values: [
        [
          'Рекомендательная система по распределению биоресурсов',
          6,
          800000,
          'Проект',
          5,
        ],
        ['Генерация текста для сайтов', 3, 200000, 'Идея', 2],
        ['Рекомендательная система по подбору стилей', 3, 200000, 'Идея', 2],
        ['Контроль производственных помещений', 2, 100000, 'Идея', 2],
        ['Чат-бот для обработки звонков клиентов', 5, 450000, 'Проект', 6],
      ],
    },
  ];
  selectedCategory(event: MatAutocompleteSelectedEvent) {
    const value = event.option.viewValue;
    let f = this.data.find((d) => d.tag == value);
    if (f) {
      this.chart.data = f.values;
    }
  }

  logout() {
    this.router.navigate(['/auth/login']);
    this.authService.Logout();
  }

  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {
    this.chart.data = this.data[2].values;
    this.myControl = new FormControl(this.data[0].tag);
  }
}
