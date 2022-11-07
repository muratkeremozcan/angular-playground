import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from '../../model';

const mockHero: Hero = {
  id: 42,
  name: 'new hero name'
};

describe('Dashboard Hero Component', () => {
  it('should initialize properly with no input properties', () => {
    cy.mount(DashboardHeroComponent);
  });

  it('should display a hero name when provided via input', () => {
    cy.mount(DashboardHeroComponent).then((wrapper) => {
      wrapper.component.hero = mockHero;
      wrapper.fixture.detectChanges();
      return cy.wrap(wrapper);
    });

    cy.get('[data-cy="hero"]').should('have.text', 'NEW HERO NAME');
  });

  it('should emit the selected hero to the consumer when clicked', () => {
    cy.mount(DashboardHeroComponent, {
      componentProperties: {
        selected: {
          emit: cy.spy().as('selectedSpy')
        } as any
      },
      imports: [DashboardHeroComponent]
    }).then((wrapper) => {
      wrapper.component.hero = mockHero;
      wrapper.fixture.detectChanges();
      return cy.wrap(wrapper);
    });

    cy.get('[data-cy="hero"]').click();

    cy.get('@selectedSpy').should('have.been.calledWith', mockHero);
  });
});
