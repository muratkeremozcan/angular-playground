import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'banner',
  template: '<h1>{{title}}</h1>',
  styles: [
    `
      h1 {
        color: green;
        font-size: 350%;
        margin: 0;
      }
    `
  ]
})
export class BannerComponent {
  @Input() title = 'Test Tour of Heroes';
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
