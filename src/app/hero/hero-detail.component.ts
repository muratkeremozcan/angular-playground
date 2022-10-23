import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Hero } from '../model';
import { HeroDetailService } from './hero-detail.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  constructor(private heroDetailService: HeroDetailService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // get hero when `id` param changes
    this.route.paramMap.subscribe((pmap) => this.getHero(pmap.get('id')));
  }

  save(): void {
    this.heroDetailService.saveHero(this.hero).subscribe(() => this.gotoList());
  }

  cancel() {
    this.gotoList();
  }

  gotoList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private getHero(id: string): void {
    // when no id or id===0, create new blank hero
    if (!id) {
      this.hero = { id: 0, name: '' } as Hero;
      return;
    }

    this.heroDetailService.getHero(id).subscribe((hero) => {
      if (hero) {
        this.hero = hero;
      } else {
        this.gotoList(); // id not found; navigate to list
      }
    });
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
