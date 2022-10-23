import { Spectator, createComponentFactory, byText } from '@ngneat/spectator/jest';
import { BannerComponent } from './banner.component';

// [1].1 testing components, basic example
// setup the component much less overhead with spectator (1.1)
// access the TS with spectator.component  (1.2)
// use spectator.detectChanges()  to trigger the change detection (1.3), (do not have to do it always)
// use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries' (1.4)

describe('[1].1 testing components, basic example', () => {
  let component: BannerComponent;

  // (1.1) setup the component
  let spectator: Spectator<BannerComponent>;
  const createComponent = createComponentFactory({
    component: BannerComponent
    // detectChanges: false // we can just set it to default true instead of detectChanges in beforeEach. We are not controlling it in this test anyway
  });

  beforeEach(() => {
    spectator = createComponent(); // (1.1) setup the component.. TestBed.configureTestingModule({..})
    component = spectator.component; // (1.2) access the TS...     comp = fixture.debugElement.componentInstance
  });

  it('use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries', () => {
    expect(spectator.query('h1')).toHaveText(component.title);

    expect(spectator.query(byText(component.title))).toBeTruthy();
  });
});
