import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hero } from '../../model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'dashboard-hero',
  template: `<div (click)="click()" data-cy="hero" class="hero qa-hero">{{ hero?.name | uppercase }}</div>`,
  styleUrls: ['./dashboard-hero.component.css']
})
export class DashboardHeroComponent {
  @Input() hero: Hero;
  @Output() selected = new EventEmitter<Hero>();
  click() {
    this.selected.emit(this.hero);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
