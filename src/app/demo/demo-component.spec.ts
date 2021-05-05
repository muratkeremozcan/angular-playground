/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {
  LightswitchComponent,
  Child1Component,
  ExternalTemplateComponent,
  InputComponent, IoParentComponent,
  MyIfComponent, MyIfChildComponent, MyIfParentComponent,
  ReversePipeComponent
} from './demo';
import { Spectator, createComponentFactory, byText } from '@ngneat/spectator/jest';

import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

// [1] testing components, various examples
// setup the component much less overhead with spectator (1.1)
// access the TS with spectator.component  (1.2)
// KEY with nested components: using fakeAsync , tick and detectChanges  (1.3)
// use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries' (1.4)
// KEY: you can use async functions and await spectator.fixture.whenStable() to work with dispatching events


// does not add to coverage. Skipping for CI
describe.skip('[1] testing components, various examples', () => {

  it('should create a component with inline template', () => {
    const spectator: Spectator<Child1Component> = createComponentFactory({
      component: Child1Component,
    })();

    expect(spectator.query(byText('Child'))).toBeDefined();
  });

  it('should create a component with external template', () => {
    const spectator: Spectator<ExternalTemplateComponent> = createComponentFactory({
      component: ExternalTemplateComponent,
    })();

    expect(spectator.query(byText('from external template'))).toBeDefined();
  });

  it('should allow changing members of the component', () => {
    const spectator: Spectator<MyIfComponent> = createComponentFactory({
      component: MyIfComponent,
      detectChanges: false
    })();
    const component = spectator.component;

    expect(spectator.query(byText('MyIf()'))).toBeDefined();

    component.showMore = true;
    spectator.detectChanges();
    expect(spectator.query(byText('MyIf(More)'))).toBeDefined();
  });

  // KEY with nested components: using fakeAsync , tick and detectChanges (1.3)
  it('should create a nested component bound to inputs/outputs', fakeAsync(() => {
    const spectator: Spectator<IoParentComponent> = createComponentFactory({
      component: IoParentComponent,
      detectChanges: false
    })();
    const component = spectator.component;

    spectator.detectChanges();
    const heroes = spectator.queryAll('.hero');
    expect(heroes.length).toBe(4);

    tick();
    spectator.detectChanges();

    spectator.click('.hero');
    const hero = component.heroes[0];
    spectator.detectChanges();

    expect(spectator.query('p').innerHTML).toContain(hero.name);
    expect(spectator.query(byText(`The selected hero is ${hero.name}`))).toBeTruthy();
    expect(spectator.query(byText(`The selected hero is ${hero.name}`, { selector: 'p' }))).toBeTruthy();
  }));

  it('should support clicking a button', () => {
    const spectator: Spectator<LightswitchComponent> = createComponentFactory({
      component: LightswitchComponent,
      detectChanges: false
    })();

    spectator.detectChanges();
    expect(spectator.query(byText(/is off/))).toBeDefined();

    spectator.click('button');
    spectator.detectChanges();
    expect(spectator.query(byText(/is on/))).toBeDefined();
  });

  it('should support entering text in input box (ngModel)', async () => {
    const spectator: Spectator<InputComponent> = createComponentFactory({
      component: InputComponent,
      detectChanges: false
    })();
    const component = spectator.component;
    const input: HTMLInputElement = spectator.query('input');

    spectator.detectChanges();
    expect(component.name).toBe('John');

    input.value = 'Sally';
    // Dispatch a DOM event so that Angular learns of input value change.
    // then wait while ngModel pushes input value to comp.name
    input.dispatchEvent(new Event('input'));
    await spectator.fixture.whenStable();

    expect(component.name).toBe('Sally');
  });

  it('ReversePipeComp should reverse the input text', async () => {
    const spectator: Spectator<ReversePipeComponent> = createComponentFactory({
      component: ReversePipeComponent,
      detectChanges: false
    })();
    const component = spectator.component;
    const input = spectator.query('input') as HTMLInputElement;
    const span = spectator.query('span') as HTMLElement;
    const inputText = 'the quick brown fox.';
    const expectedText = '.xof nworb kciuq eht';

    spectator.detectChanges();

    // simulate user entering new name in input
    input.value = inputText;
    // Dispatch a DOM event so that Angular learns of input value change.
    // then wait while ngModel pushes input value to comp.text
    input.dispatchEvent(new Event('input'));
    await spectator.fixture.whenStable();
    expect(component.text).toBe(inputText);

    // it takes one more change detection for the pipe operator to effect the dom
    spectator.detectChanges();
    expect(span.textContent).toBe(expectedText);
  });

  // note: this part is not very useful, but there for code coverage
  describe('lifecycle hooks w/ MyIfParentComp', () => {
    let spectator: Spectator<MyIfParentComponent>;
    let parent: MyIfParentComponent;
    let child: MyIfChildComponent;

    const createComponent = createComponentFactory({
      component: MyIfParentComponent,
      imports: [FormsModule],
      declarations: [MyIfChildComponent, MyIfParentComponent],
      detectChanges: false
    });

    beforeEach(() => {
      spectator = createComponent();
      parent = spectator.component;
    });

    it('should instantiate parent component, OnInit should NOT be called before first detectChanges', () => {
      expect(parent).toBeTruthy();
      expect(parent.ngOnInitCalled).toBe(false);

      spectator.detectChanges();
      expect(parent.ngOnInitCalled).toBe(true);
    });

    it('child component should exist after OnInit, should have called child component OnInit', () => {
      spectator.detectChanges();
      getChild();
      expect(child instanceof MyIfChildComponent).toBe(true);
      expect(child.ngOnInitCalled).toBe(true);
      expect(child.ngOnChangesCounter).toBe(1);
    });

    it('changed parent value flows to child', () => {
      spectator.detectChanges();
      getChild();

      parent.parentValue = 'foo';
      spectator.detectChanges();
      expect(child.ngOnChangesCounter).toBe(2);
      expect(child.childValue).toBe('foo');
    });

    /**
     * Get the MyIfChildComp from parent; fail w/ good message if cannot.
     */
    function getChild() {

      let childDe: DebugElement; // DebugElement that should hold the MyIfChildComp

      // The Hard Way: requires detailed knowledge of the parent template
      try {
        childDe = spectator.debugElement.children[4].children[0];
      } catch (err) { /* we'll report the error */ }

      // DebugElement.queryAll: if we wanted all of many instances:
      childDe = spectator.debugElement
        .queryAll(de => de.componentInstance instanceof MyIfChildComponent)[0];

      // WE'LL USE THIS APPROACH !
      // DebugElement.query: find first instance (if any)
      childDe = spectator.debugElement
        .query(de => de.componentInstance instanceof MyIfChildComponent);

      if (childDe && childDe.componentInstance) {
        child = childDe.componentInstance;
      } else {
        fail('Unable to find MyIfChildComp within MyIfParentComp');
      }

      return child;
    }
  });
});
