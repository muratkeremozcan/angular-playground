import { Spectator, createRoutingFactory } from '@ngneat/spectator/jest';
import { DashboardComponent } from './dashboard.component';
import { HeroService } from '../model';
import { Hero } from '../model';
import { of } from 'rxjs';
import { DashboardHeroComponent } from './dashboard-hero.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

// [6] testing components that include other components, services (example[5]), and routing (example[4])
// setup the component with routing, use createRoutingFactory to auto-mock Router and ActivatedRoute (6.1). Just like (4.1)
// mock the service dependency (6.1.2), just like (5.1.2) .
// KEY: mock the internal components, use the ng-mocks library MockComponent. (6.1.5)
// access the TS with spectator.component  (6.2)
// use spectator.detectChanges()  to trigger the change detection (6.3)
// to access the in-line line component, query it. If there is an ngFor, use queryAll:  spectator.query/queryAll<ChildComponent>(ChildComponent)  (6.4)
// access the (in-line) component inputs and verify them (6.5)
// access the (in-line) component outputs by emitting events (6.6)
// spy on the routing to verify that the event causes an effect (6.7)

describe('[6] Testing components that include other components, services (example[5]), and routing (example[4])', () => {
  let component: DashboardComponent;
  let spectator: Spectator<DashboardComponent>;

  const heroes: Hero[] = [
    { id: 41, name: 'Bob' },
    { id: 42, name: 'Carol' },
    { id: 43, name: 'Ted' },
    { id: 44, name: 'Alice' },
    { id: 45, name: 'Speedy' },
    { id: 46, name: 'Stealthy' }
  ];

  // setup the component with routing, use createRoutingFactory to auto-mock Router and ActivatedRoute (6.1)
  const createComponent = createRoutingFactory({
    component: DashboardComponent,
    // (6.1.5) KEY: mock the internal components, use the ng-mocks library MockComponent.
    // Instead of using CUSTOM_ELEMENTS_SCHEMA, which might hide some issues and won't help you to set inputs, outputs, etc., ng-mocks will auto mock the inputs, outputs, etc. for you
    declarations: [MockComponent(DashboardHeroComponent)],
    // (6.1.2) mock the service dependency,
    providers: [
      MockProvider(HeroService, {
        getHeroes: () => of(heroes)
      })
    ],
    // mocks: [HeroService], // this and (6.1.3, 6.1.4), are the long way of doing it
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component; // (6.2) access the TS with spectator.component

    // (6.1.3) inject the service dependency:  depService = spectator.inject(DepService)
    // heroServiceSpy = spectator.inject(HeroService);
    // (6.1.4) stub the external service's return value
    // heroService = jest.spyOn(heroServiceSpy, 'getHeroes').mockReturnValue(of(heroes));
  });

  it('sanity', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT have heroes before ngOnInit, snapshot test before onInit', () => {
    // access the TS with spectator.component  (6.2)
    expect(component.heroes).toHaveLength(0);
  });

  it('should HAVE heroes after ngOnInit, snapshot test the component after onInit', () => {
    // use spectator.detectChanges()  to trigger the change detection (6.3),
    spectator.detectChanges();
    expect(component.heroes.length).toBeGreaterThan(0);
    expect(spectator.queryAll('dashboard-hero')).toHaveLength(4);
  });

  // This component has a subscribe OnInit, we control that with fakeAsync or async and await spectator.fixture.whenStable();
  it('should tell ROUTER to navigate when hero clicked: fakeAsync version', fakeAsync(() => {
    spectator.tick();

    // (6.4) to access the in-line line component, query it. If there is an ngFor, use queryAll:  spectator.query/queryAll<ChildComponent>(ChildComponent)
    const inLineComponents = spectator.queryAll<DashboardHeroComponent>(DashboardHeroComponent);
    expect(inLineComponents).toBeTruthy();

    const firstHero = inLineComponents[0];
    // (6.5) access the (in-line) component inputs and verify them
    expect(firstHero.hero.name).toBe('Carol');
    // (6.6) access the (in-line) component outputs by emitting events
    firstHero.selected.emit({ id: 42, name: 'Carol' });
    // (6.7) spy on the routing to verify that the event causes an effect
    expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalledWith('/heroes/42');
  }));

  it('should tell ROUTER to navigate when hero clicked: async whenStable version', async () => {
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    const inLineComponents = spectator.queryAll<DashboardHeroComponent>(DashboardHeroComponent);
    expect(inLineComponents).toBeTruthy();

    const firstHero = inLineComponents[0];
    expect(firstHero.hero.name).toBe('Carol');

    firstHero.selected.emit({ id: 42, name: 'Carol' });

    expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalledWith('/heroes/42');
  });
});
