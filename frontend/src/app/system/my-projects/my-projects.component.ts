import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {

  constructor() { }

  reviews: any[] = [
    {
      name: 'Петров Сергей',
      gender: 'мужской',
      role: 'Участник',
      text: 'Интересный проект. Можно ли уточнить, какие технологии вы использовали?',
      date: '01.11.2022'
    },
    {
      name: 'Петрова Сергия',
      gender: 'женский',
      role: 'Участник',
      text: 'Интересный проект. Можно ли уточнить, какие технологии вы использовали?',
      date: '01.11.2022'
    }
  ]

  ngOnInit(): void {
  }

  //@ts-ignore
  @ViewChild('carousel') carousel: ElementRef;

  places: any[] = [
    {
      title: 'Экологический мониторинг атмосферного воздуха',
      authors: [
        'Петров Игорь', 'Иванова Мария'
      ],
      stage: 'идея',
      innovation: 12,
      realization: 7,
      category: 'Лидеры инноваций'
    },
    {
      title: 'Автоматизированная система Agile',
      authors: [
        'Петров Игорь', 'Иванова Мария'
      ],
      stage: 'идея',
      innovation: 12,
      realization: 7,
      category: 'Лидеры инноваций'
    },
    {
      title: 'Генерация мотивационной политики в компании',
      authors: [
        'Петров Игорь', 'Иванова Мария'
      ],
      stage: 'идея',
      innovation: 12,
      realization: 7,
      category: 'Лидеры инноваций'
    },
    {
      title: 'Экологический мониторинг атмосферного воздуха',
      authors: [
        'Петров Игорь', 'Иванова Мария'
      ],
      stage: 'идея',
      innovation: 12,
      realization: 7,
      category: 'Лидеры инноваций'
    },
    {
      title: 'Экологический мониторинг атмосферного воздуха',
      authors: [
        'Петров Игорь', 'Иванова Мария'
      ],
      stage: 'идея',
      innovation: 12,
      realization: 7,
      category: 'Лидеры инноваций'
    },
  ]

  goToNext() {
    let carousel = document.getElementById('carousel')
    // if (this.current != this.places.length - 1) {
    //   this.current++
    // }
    //@ts-ignore
    let item = document.getElementById('item_1').offsetWidth
    //@ts-ignore
    carousel.scrollBy({
      behavior: 'smooth',
      left: item + 16
    })
    console.log('scroll right' + item)
  }

  goToPrev() {
    let carousel = document.getElementById('carousel')
    // if (this.current != 0) {
    //   this.current--
    // }
    //@ts-ignore
    let item = document.getElementById('item_1').offsetWidth
    //@ts-ignore
    carousel.scrollBy({
      behavior: 'smooth',
      left: - item - 16
    })
    console.log('scroll left' + item)
  }

}
