import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from '../../model';

const mockHero: Hero = {
  id: 42,
  name: 'Flash'
};

describe('Dashboard Hero Component', () => {
  it('should display a hero name when provided via Input', () => {
    cy.mount(DashboardHeroComponent, {
      componentProperties: {
        hero: mockHero
      }
    });

    cy.get('[data-cy="hero"]').should('have.text', 'FLASH');
  });

  /**
   * 9. Stubbing outputs
   * Cypress gives you the ability to just use autoSpyOutputs. They use
   * whatever the name of the property with spy appended. Otherwise, you can
   * just pass the output property and use createOutputSpy<T>.
   */

  it('should emit the selected hero to the consumer when clicked', () => {
    cy.mount(DashboardHeroComponent, {
      componentProperties: {
        hero: mockHero
      },
      autoSpyOutputs: true
    });

    cy.get('[data-cy="hero"]').click();

    cy.get('@selectedSpy').should('have.been.calledWith', mockHero);
  });
});
