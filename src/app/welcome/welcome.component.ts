import { Component, OnInit } from '@angular/core';
import { UserService } from '../model';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [NavBarComponent],
  template: `<div style="display: flex; justify-content: space-between">
    <h3 class="welcome">
      <i>{{ welcome }}</i>
    </h3>
    <nav-bar></nav-bar>
  </div>
  `
})
export class WelcomeComponent implements OnInit {
  welcome: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.welcome = this.userService.isLoggedIn ? 'Welcome, ' + this.userService.user.name : 'Please log in.';
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
