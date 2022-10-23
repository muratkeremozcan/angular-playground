import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard/dashboard.component').then((c) => c.DashboardComponent) },
  { path: 'about', component: AboutComponent },
  { path: 'heroes', loadComponent: () => import('./hero/hero-list.component').then((c) => c.HeroListComponent) },
  { path: 'heroes/:id', loadComponent: () => import('./hero/hero-detail.component').then((c) => c.HeroDetailComponent) }
];

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
