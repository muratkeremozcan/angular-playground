import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Hero, HeroService } from '../model';
import { DashboardHeroComponent } from './dashboard-hero/dashboard-hero.component';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '../directives/highlight.directive';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [RouterModule, DashboardHeroComponent, HighlightDirective, CommonModule],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public heroes: Hero[] = [];

  constructor(private router: Router, private heroService: HeroService) {}

  get title(): string {
    const cnt = this.heroes.length;
    return cnt === 0 ? 'No Heroes' : cnt === 1 ? 'Top Hero' : `Top ${cnt} Heroes`;
  }

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes.slice(1, 5)));
  }

  gotoDetail(hero: Hero): void {
    const url = `/heroes/${hero.id}`;
    this.router.navigateByUrl(url);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
