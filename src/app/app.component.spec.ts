import { AppComponent } from './app.component';
import { Spectator, createRoutingFactory, byText } from '@ngneat/spectator/jest';
import { WelcomeComponent } from './welcome/welcome.component';
import { MockComponent } from 'ng-mocks';
import { BannerComponent } from './banner/banner.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLink } from '@angular/router';
import { MockHeroesComponent } from './mock-heroes.component';

// [7] testing components that include routerLinks
// setup the component with createRoutingFactory to auto-mock Router and ActivatedRoute (7.1)
// create a MockComponent that will be used in the router-outlet (7.1.2)
// set the stubsEnabled option to false to setup an integration test (7.1.3)
// use the RouterTestingModule and RouterLink from Angular (7.1.4)
// pass a routing configuration using routes: property, use the MockComponent in the in the outlet (7.1.5)
// KEY: mock the internal components, use the ng-mocks library MockComponent (7.1.6). just like (6.1.5)

// (7.1.2) create a MockComponent that will be used in the router-outlet  (imported)

describe('App component', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createRoutingFactory({
    component: AppComponent,
    detectChanges: false,
    // (7.1.3) set the stubsEnabled option to false to setup an integration test
    stubsEnabled: false,
    // (7.1.4) use the RouterTestingModule and RouterLink from Angular
    providers: [RouterLink],
    imports: [RouterTestingModule],
    // (7.1.5) pass a routing configuration using routes: property, use the MockComponent in the in the outlet
    routes: [
      {
        path: '',
        component: AppComponent
      },
      {
        path: 'heroes',
        component: MockHeroesComponent
      }
    ],
    // (7.1.6) mock the internal components, use the ng-mocks library MockComponent
    declarations: [MockComponent(BannerComponent), MockComponent(WelcomeComponent), MockHeroesComponent]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('sanity', async () => {
    expect(component).toBeTruthy();
  });

  it('click navigate to routes', () => {
    spectator.detectChanges();

    spectator.click(byText('Heroes'));
    spectator.detectChanges();

    expect(spectator.query(byText('MockHeroes'))).toBeTruthy();
  });
});
