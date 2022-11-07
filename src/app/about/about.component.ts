import { Component } from '@angular/core';
import { TwainComponent } from '../twain/twain.component';
import { HighlightDirective } from '../directives/highlight.directive';

@Component({
  selector: 'about',
  standalone: true,
  imports: [TwainComponent, HighlightDirective],
  template: `
    <h2 data-cy="page-title" highlight="skyblue">About</h2>
    <h3>Quote of the day:</h3>
    <twain-quote></twain-quote>
  `
})
export class AboutComponent {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
