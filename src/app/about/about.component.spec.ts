import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { AboutComponent } from './about.component';
import { HighlightDirective } from '../directives/highlight.directive';
import { TwainComponent } from '../twain/twain.component';
import { MockComponent } from 'ng-mocks';

// [8] testing directives, very similar to testing components [1]
// use NO_ERRORS_SCHEMA (8.1)
// you may need to cast selectors as HTMLElement, instead of the default Element (8.2)

xdescribe('[7] Testing directives: very similar to components', () => {
  let component: AboutComponent;
  let spectator: Spectator<AboutComponent>;

  const createComponent = createComponentFactory({
    component: AboutComponent,
    imports: [HighlightDirective],
    mocks: [MockComponent(TwainComponent)]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('Use NO_ERRORS_SCHEMA and may need to cast selectors as HTMLElement', () => {
    // (8.2) IMPORTANT: you may need to cast selectors as HTMLElement, instead of the default Element
    const h2: HTMLElement = spectator.query('h2');
    expect(h2).toBeTruthy();
    expect(h2.style.backgroundColor).toBe('skyblue');
  });
});
