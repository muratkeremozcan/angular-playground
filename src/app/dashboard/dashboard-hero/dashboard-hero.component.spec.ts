import { DashboardHeroComponent } from './dashboard-hero.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Hero } from '../../model';
import { By } from '@angular/platform-browser';

describe('Dashboard Hero Component', () => {
  const mockHero: Hero = {
    id: 42,
    name: 'Flash'
  };

  let component: DashboardHeroComponent;
  let fixture: ComponentFixture<DashboardHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeroComponent]
    });

    fixture = TestBed.createComponent(DashboardHeroComponent);
    component = fixture.componentInstance;
  });

  it('should display a hero name when provided via Input', () => {
    component.hero = mockHero;
    fixture.detectChanges();

    const el: HTMLElement = fixture.debugElement.query(By.css('[data-cy="hero"]')).nativeElement;
    expect(el.innerText).toBe('FLASH');
  });

  /**
   * 8. Output Testing
   * Jasmine has great spy creation, but spying on component properties is always
   * weird and almost feels like an anti-pattern. Mocking outputs requires you to
   * spy on the output property and wait for the change to occur. One can use
   * FakeAsync/Tick or Fixture/whenStable.
   */
  it('should emit the selected hero to the consumer when clicked', fakeAsync(() => {
    component.hero = mockHero;
    fixture.detectChanges();

    spyOn(component.selected, 'emit');

    const el: HTMLElement = fixture.debugElement.query(By.css('[data-cy="hero"]')).nativeElement;
    el.click();
    tick();
    expect(component.selected.emit).toHaveBeenCalledOnceWith(mockHero);
  }));
});
