import { BannerComponent } from './banner.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('Banner Component', () => {
  /**
   * 1. Compile the component to test
   * There is a little more set up declaring global variables that will be used
   * in each individual scope.
   */
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    /**
     * In order to compile your component, you will need to import it and any
     * providers or dependencies. This can end up getting extremely bloated.
     */
    await TestBed.configureTestingModule({
      imports: [BannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    /**
     * 3. Dealing with Change Detection
     * Anytime the component state changes, you need to call fixture.detectChanges()
     * to force changeDetection on your component.
     *
     * There is a fixture.autoDetectChanges() that I've never been able to get work.
     */
    fixture.detectChanges();
  });

  it('loads with a default title', () => {
    const header: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.innerText).toBe('Test Tour of Heroes');
  });

  it('can change the title', () => {
    /**
     * 5. Manipulating Inputs in Jasmine
     * With Jasmine you don't get the benefit of just using what is essentially jQuery on the DOM
     * Instead you have to use more of a mix of OOP and some functional to build out
     * your tests.
     *
     * Here, I have to manually update the @Input title and call change detection before
     * being able to assert on the value on the DOM.
     */
    component.title = 'This is a test';
    const header: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    fixture.detectChanges();

    expect(header.innerText).toBe('This is a test');
  });

  /**
   * 6. Style Testing
   * Testing styles in jasmine is a bit difficult. Generally, in Angular
   * applications, you won't be testing values like this, but that doesn't you mean you
   * shouldn't be. Especially if this is important to the value.
   *
   * For whatever reason, The mirrored test does not work in Jasmine, but it does work in
   * Cypress.
   */
  // why does this test not work?
  xit('loads with a green font color', () => {
    const header: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.style.color).toBe('green');
  });
});
