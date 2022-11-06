import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-projects-list',
  templateUrl: './my-projects-list.component.html',
  styleUrls: ['./my-projects-list.component.scss']
})
export class MyProjectsListComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {

  }

  feed: any[] = [
    {
      title: 'Автоматизированная система по расчету ресурсов производства',
      authors: [
        'Петров Игорь', 'Иванова Мария'
      ],
      stage: 'Проект.MVP',
      innovation: 12,
      realization: 7,
      category: 'Лидеры инноваций'
    }
  ]

  ngOnInit(): void {

  }

  openProject() {
    this.router.navigate(['/system/my-projects']);
  }

}
