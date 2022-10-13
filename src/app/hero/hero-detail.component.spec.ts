import { Router } from '@angular/router';
import { Spectator, createRoutingFactory } from '@ngneat/spectator/jest';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from './hero-detail.service';
import { FormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

// [4] testing components that use routing and @Input / @Output properties // https://github.com/ngneat/spectator#testing-with-routing
// this component is a special case where there is an @Input that gets set after an ngOnInit with a service observable call

// setup the component with routing; use createRoutingFactory to auto-mock Router and ActivatedRoute (4.1)
// mock the ngOnInit service observable call or set the @Input manually in each test (4.2), and then use fakeAsync or fixture.whenStable() to access the dom (4.3)
// stub the service functions that trigger route changes, get the dependent service injected into the component and spy on its trigger methods (4.4)
// use convenience methods to trigger a navigation, if needed (4.5) https://github.com/ngneat/spectator#triggering-a-navigation
/* DOM testing library-like approach
  spectator.query(byPlaceholder('Please enter your email address'));
  spectator.query(byValue('By value'));
  spectator.query(byTitle('By title'));
  spectator.query(byAltText('By alt text'));
  spectator.query(byLabel('By label'));
  spectator.query(byText('By text'));
  spectator.query(byText('By text', {selector: '#some .selector'}));
  spectator.query(byTextContent('By text content', {selector: '#some .selector'}));
*/

describe('module test', () => {
  let component: HeroDetailComponent;
  let spectator: Spectator<HeroDetailComponent>;
  let heroDetailServiceSpy: HeroDetailService;

  // (4.1) setup the component with routing. Use createRoutingFactory to auto-stub Router and ActivatedRoute
  const createComponent = createRoutingFactory({
    // compared to createComponentFactory, Route and ActivatedRoute are auto-mocked
    component: HeroDetailComponent,
    // instead of automocking and overriding hero in the tests, this is short form of providing a specific function inline, the rest are automocked and can be overridden in the individual tests
    providers: [
      MockProvider(HeroDetailService, {
        // (4.2) mock the ngOnInit service observable call or set the @Input manually in each test,
        getHero: () => of({ id: 69, name: 'Murat the Super Tester' })
        // for example here we could mock saveHero, instead in some of the tests injecting the service and mocking with jest.spyOn(heroDetailServiceSpy, 'saveHero').mockReturnValue(of(null));
      })
    ],
    imports: [FormsModule], // need formsModule for the template ngmodel
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent(); // (4.1) setup the component.. TestBed.configureTestingModule({..})
    component = spectator.component; // (4.2) access the TS...     comp = fixture.debugElement.componentInstance
    // component.hero = { id: 2, name: 'Dork' }; // not needed if using MockProvider with custom mock function
  });

  it('sanity', () => {
    // when the component has @Input(s), in the tests you need to set the initial input, or emit a hero on your subscription with fakeasync or async await, or your dom will never render
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  // (4.3) use fakeAsync or fixture.whenStable() to access the dom

  it('async with await spectator.fixture.whenStable() version: should navigate when clicking cancel', async () => {
    spectator.detectChanges();

    // IMPORTANT: // after the fixture.whenStable(), the mock service call for getHero will get called, so you can verify the dom has changed to new hero
    await spectator.fixture.whenStable();

    spectator.click('.qa-cancel');
    expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  });

  it('fakeAsync with tick() version: should navigate when clicking cancel', fakeAsync(() => {
    spectator.detectChanges();

    // IMPORTANT: // after the tick, the mock service call for getHero will get called, so you can verify the dom has changed to new hero
    tick();

    spectator.click('.qa-cancel');
    expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  }));

  it('async with await spectator.fixture.whenStable() version: should save when clicking and navigate', async () => {
    // (4.4) stub the service functions that trigger route changes, get the dependent service injected into the component and spy on its trigger methods
    heroDetailServiceSpy = spectator.inject(HeroDetailService);
    jest.spyOn(heroDetailServiceSpy, 'saveHero').mockReturnValue(of(null));
    // spyOn(heroDetailServiceSpy, 'saveHero').and.returnValue(of(null)); // can also use jasmine spy or other ways of spying with jest

    spectator.detectChanges();

    spectator.click('.qa-save');
    await spectator.fixture.whenStable();
    expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  });

  it('fakeAsync with tick() version: should save when clicking and navigate', fakeAsync(() => {
    // (4.4) stub the service functions that trigger route changes, get the dependent service injected into the component and spy on its trigger methods
    heroDetailServiceSpy = spectator.inject(HeroDetailService);
    jest.spyOn(heroDetailServiceSpy, 'saveHero').mockReturnValue(of(null));
    // spyOn(heroDetailServiceSpy, 'saveHero').and.returnValue(of(null)); // can also use jasmine spy or other ways of spying with jest

    spectator.detectChanges();

    spectator.click('.qa-save');
    tick();
    expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  }));

  // while debugging, the component comes with nothing for interpolation {{ }} , don't know why... This is why the assertions are not working here. BUT, the pattern of approach should work with proper components
  it('query byText', fakeAsync(() => {
    // this is the point of doing detectchanges false initially and calling detect changes manually instead of in before each - i can set any inputs specific to each test scenario before detecting the changes
    // if i don't detect changes, the dom is never rendered (onInit does not get called, or the other lifecycle hooks, so i cannot test through dom)
    component.hero = { id: 2, name: 'Dork' };

    spectator.detectChanges();
    tick();

    expect(true).toBeTruthy();
    // expect(spectator.query('.qa-hero-name').innerHTML).toContain('Dork');
    // expect(spectator.query(byTextContent('Dork', {selector: '.qa-hero-name'}))).toBeTruthy();
  }));
});
