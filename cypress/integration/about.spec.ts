import { skipOn } from '@cypress/skip-test';

describe('about', () => {
  before('visit about', () => {
    cy.visit('/');
    cy.get('[routerlink="/about"]').click();
    cy.url().should('include', '/about');
    cy.contains('Quote of the day');
  });

  it('should get a different quote on next', () => {
    // use cy.skipOn to reproduce the issue
    // cy.skipOn('local');
    skipOn('local');
    cy.get('.twain > i').then((initialQuote) => {
      cy.get('button').click();

      cy.get('.twain > i').should('not.contain', '...');
      cy.get('.twain > i').should('not.contain', initialQuote);
    });
  });
});
