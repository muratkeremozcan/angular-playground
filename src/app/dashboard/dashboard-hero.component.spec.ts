import { Hero } from '../model/hero';
import { Spectator, createComponentFactory, byText } from '@ngneat/spectator/jest';
import { DashboardHeroComponent } from './dashboard-hero.component';

// [1].2 unit testing components with @Input and @Output properties
// setup the component much less overhead with spectator (1.1)
// access the TS with spectator.component  (1.2)
// use spectator.detectChanges()  to trigger the change detection (1.3),
// use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries' (1.4)
// to test @Output subscribe to the event emitter and setup what will be emitted (1.5.1),
// trigger the event using spectator events api https://github.com/ngneat/spectator#events-api (1.5.2) and verify what is emitted (1.5.3)

describe('[1] Testing Components with Spectator: unit testing components with @Input and @Output properties', () => {
  let comp: DashboardHeroComponent;

  // (1.1) setup the component
  let spectator: Spectator<DashboardHeroComponent>;
  const createComponent = createComponentFactory({
    component: DashboardHeroComponent,
    detectChanges: false // KEY: no waitForAsync necessary, and we should explicitly set detectChanges as false
  });

  beforeEach(() => {
    spectator = createComponent(); // (1.1) setup the component.. TestBed.configureTestingModule({..})
    comp = spectator.component; // (1.2) access the TS...      comp = fixture.debugElement.componentInstance
  });

  it('(1.1) setup the component, (1.2) access the TS with spectator.component, (1.4) access the DOM with spectator.element', () => {
    expect(comp).toBeTruthy();
  });

  describe('(1.3) spectator.detectChanges() to trigger change detection', () => {
    let mockHeroInput: Hero;

    beforeEach(() => {
      // this component has an @Input property. So, simulate the @Input hero property being set by the parent
      // note: when the component has @Input(s), in the tests you need to set the initial input, or emit a hero on your subscription, or your dom will never render

      mockHeroInput = comp.hero = { id: 42, name: 'new Hero Name' };

      // (1.3) detectChanges() : to update the bindings / trigger change detection
      spectator.detectChanges();
    });

    it('Testing @Input: , (1.4) use DOM testing library convenience methods https://github.com/ngneat/spectator#queries', () => {
      // (1.4) access the DOM...
      expect(spectator.query('.hero')).toHaveText(mockHeroInput.name.toUpperCase());
      expect(spectator.query(byText(mockHeroInput.name.toUpperCase(), { selector: '.hero' }))).toBeTruthy(); // extra check
    });

    it('Testing the @Output: (1.5.1) subscribe to the event emitter and set up what will be emitted, (1.5.2) use spectator events api (https://github.com/ngneat/spectator#events-api) to trigger click', () => {
      let emittedHero: Hero;

      // (1.5.1) subscribe to the event emitter @Output and set up what will be emitted (this.hero will be emitted which we emulate as emittedHero)
      comp.selected.subscribe((hero: Hero) => (emittedHero = hero));

      // (1.5.2)  trigger the event using spectator events api https://github.com/ngneat/spectator#events-api
      spectator.click('.hero');

      // (1.5.3) verify that what is emitted
      expect(emittedHero).toBe(mockHeroInput);
    });
  });
});
