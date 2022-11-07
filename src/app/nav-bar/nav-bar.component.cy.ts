import { NavBarComponent } from './nav-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Nav Bar Component', () => {
  beforeEach(() => {
    cy.mount(NavBarComponent, {
      imports: [RouterTestingModule]
    });
  });

  it('should contain 3 routes', () => {
    cy.get('a').should('have.length', 3);
  });

  it('routes should have proper names and paths', () => {
    const routes = ['/', '/heroes', '/about'];
    const routeNames = ['Dashboard', 'Heroes', 'About'];

    cy.get('a')
      .each((el, index) => {
        cy.wrap(el).should('have.text', routeNames[index]);
        cy.wrap(el).should('have.attr', 'href')
          .and('eq', routes[index]);
      });
  });
});
