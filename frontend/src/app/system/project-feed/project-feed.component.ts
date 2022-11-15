import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-project-feed',
  templateUrl: './project-feed.component.html',
  styleUrls: ['./project-feed.component.scss'],
})
export class ProjectFeedComponent implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    renderer.listen('document', 'click', (event: Event) => {
      let targets = [
        'name-input',
        'trend-input',
        'stage-input',
        'city-input',
        'finder-icon',
        'select-icon',
        'drop',
        'drop-options',
      ];
      //@ts-ignore
      let target = event.target.id;
      if (targets.indexOf(target) == -1) {
        this.namesFilter = [];
        this.trendFilter = [];
        this.stageFilter = [];
        this.statusFilter = [];
        this.resetFilters(true, true, true, true);
      } else if (target == targets[0]) {
        this.resetFilters(false, true, true, true);
      } else if (target == targets[1]) {
        this.resetFilters(true, false, true, true);
      } else if (target == targets[2]) {
        this.resetFilters(true, true, false, true);
      } else if (target == targets[3]) {
        this.resetFilters(true, true, true, false);
      }
    });
  }

  projects: any[] = ['Первый', 'Второй', 'Третий', 'Четвертый'];

  names: string[] = [];
  trend: string[] = [];
  stage: string[] = ['Идея', 'Проект.MVP'];
  status: string[] = [];

  namesFilter: string[] = [];
  trendFilter: string[] = [];
  stageFilter: string[] = [];
  statusFilter: string[] = [];

  nameValue: string = '';
  trendValue: string = '';
  stageValue: string = '';
  statusValue: string = '';

  feed: any[] = [
    {
      title: 'Умное расписание «Контроль здоровья» ',
      authors: ['Петров Игорь', 'Иванова Мария'],
      stage: 'Проект. Внедрение',
      innovation: 12,
      realization: 7,
      category: 'Здоровье, Медицина',

      url: 'https://images.squarespace-cdn.com/content/v1/57c92dca4402439fa1760b2d/1512753164469-CG7Z36QFA3NSGHDOBGND/strength+training.png?format=750w',

    },
    {
      title: 'Фитнес-приложение «Движение»',
      authors: ['Сидоров Иван', 'Сидоров Кирилл'],
      stage: 'Проект. MVP',
      innovation: 45,
      realization: 20,
      category: 'Спорт, Здоровье',
      url: 'https://www.iphones.ru/wp-content/uploads/2021/11/DSC04017-1.jpg',

    },
    {
      title: 'Приложение для мониторинга движения на дорогах',
      authors: ['Петров Игорь', 'Иванова Екатерина'],
      stage: 'Проект. Масштабирование',
      innovation: 67,
      realization: 100,
      category: 'Транспорт',
      url: 'https://logirus.ru/articles/articles_img/logistika-_bitva_za_-tsifru/gl.jpg',

    },
    {
      title: 'Устройства мониторинга температуры тела пассажиров в аэропортах',
      authors: ['Смирнова Алена'],
      stage: 'Идея',
      innovation: 7,
      realization: 8,
      category: 'Здоровье ',
      url: 'https://st4.depositphotos.com/9999814/24255/i/450/depositphotos_242559494-stock-photo-health-insurance-concept-doctor-in.jpg',
    },
    {
      title: 'Контроль производственных помещений',
      authors: ['Петров Петр'],
      stage: 'Проект. Внедрение',
      innovation: 16,
      realization: 29,
      category: 'Производство, Безопасность',

      url: 'https://www.idisglobal.ru/uploads/900x600_adaptiveResize_galleries_1476_isbc-5.jpg',

    },
  ];

  resetFilters(
    name: boolean = false,
    trend: boolean = false,
    stage: boolean = false,
    city: boolean = false
  ) {
    if (name) {
      this.namesFilter = [];
    }
    if (trend) {
      this.trendFilter = [];
    }
    if (stage) {
      this.stageFilter = [];
    }
    if (city) {
      this.statusFilter = [];
    }
  }

  ngOnInit(): void { }

  onNameChange(event: any) {
    this.nameValue = event.target.value;
    if (this.nameValue == '') {
      this.namesFilter = [];
    } else {
      this.namesFilter = this.names.filter(
        (name: string) =>
          name.toLowerCase().indexOf(this.nameValue.toLowerCase()) != -1
      );
    }
  }

  setName(value: string) {
    this.nameValue = value;
    this.namesFilter = [];
    this.trendValue = '';
    this.stageValue = '';
    this.statusValue = '';
    // this.usersFilter = this.users.filter(
    //   (user: any) => `${user.lastname} ${user.firstname} ${user.patronymic}` == this.nameValue
    // )
  }

  setTrend(value: string) {
    if (this.trendValue.indexOf(value) == -1) {
      let trend = this.trendValue.split(', ');
      if (trend[0] == '') {
        this.trendValue = value;
      } else {
        trend.push(value);
        this.trendValue = trend.join(', ');
      }
    } else {
      this.trendValue = this.trendValue
        .split(', ')
        .filter((Trend: string) => Trend != value)
        .join(', ');
    }
  }

  setStage(value: string) {
    if (this.stageValue.indexOf(value) == -1) {
      let stage = this.stageValue.split(', ');
      if (stage[0] == '') {
        this.stageValue = value;
      } else {
        stage.push(value);
        this.stageValue = stage.join(', ');
      }
    } else {
      this.stageValue = this.stageValue
        .split(', ')
        .filter((role: string) => role != value)
        .join(', ');
    }
  }

  onCitiesChange(event: any) {
    this.statusValue = event.target.value;
    if (this.statusValue == '') {
      this.statusFilter = [];
    } else {
      this.statusFilter = this.status.filter(
        (city: string) =>
          city.toLowerCase().indexOf(this.statusValue.toLowerCase()) != -1
      );
    }
  }

  setCity(value: string) {
    if (this.statusValue.indexOf(value) == -1) {
      let status = this.statusValue.split(', ');
      if (status[0] == '') {
        this.statusValue = value;
      } else {
        status.push(value);
        this.statusValue = status.join(', ');
      }
    } else {
      this.statusValue = this.statusValue
        .split(', ')
        .filter((city: string) => city != value)
        .join(', ');
    }
  }

  reset() {
    this.nameValue = '';
    this.trendValue = '';
    this.stageValue = '';
    this.statusValue = '';
    // this.usersFilter = [...this.users]
  }
}
