import { AboutComponent } from './about.component';

describe('About Component', () => {
  // Mount the component before the start of the test
  beforeEach(() => {
    /**
     * 10. Custom mounts
     * @see /cypress/support/component.ts
     */
    cy.mountWithHttp(AboutComponent);
  });

  it('Loads with a title and highlight', () => {
    cy.get('[data-cy=page-title]')
      .should('have.text', 'About')
      .should('have.css', 'background-color')
      .and('be.colored', 'skyblue');
  });

  it('should have an h3 element that reads "Quote of the day:"', () => {
    cy.get('h3')
      .should('have.text', 'Quote of the day:');
  });

});
