import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should contain 3 routes', () => {
    expect(fixture.debugElement
      .queryAll(By.css('a')).length)
      .toBe(3);
  });

  it('routes should have proper names and paths', () => {
    const routes = ['/', '/heroes', '/about'];
    const routeNames = ['Dashboard', 'Heroes', 'About'];

    fixture.debugElement.queryAll(By.css('a')).forEach((anchor, index) => {
      expect(anchor.nativeElement.innerText).toBe(routeNames[index]);
      expect(anchor.nativeElement.pathname).toBe(routes[index]);
    });
  });
});
