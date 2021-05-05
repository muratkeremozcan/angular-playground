import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutComponent } from './about/about.component';
import { BannerComponent } from './banner/banner.component';
import { HeroService } from './model/hero.service';
import { UserService } from './model/user.service';
import { TwainComponent } from './twain/twain.component';
import { TwainService } from './twain/twain.service';
import { WelcomeComponent } from './welcome/welcome.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    DashboardModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [HeroService, TwainService, UserService],
  declarations: [AppComponent, AboutComponent, BannerComponent, TwainComponent, WelcomeComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
