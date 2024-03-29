import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Hero, HeroService } from '../model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-heroes',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.css']
})
export class HeroListComponent implements OnInit {
  heroes: Observable<Hero[]>;
  selectedHero: Hero;

  constructor(private router: Router, private heroService: HeroService) {}

  ngOnInit() {
    this.heroes = this.heroService.getHeroes();
  }

  onSelect(hero: Hero) {
    this.selectedHero = hero;
    this.router.navigate(['../heroes', this.selectedHero.id]);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
