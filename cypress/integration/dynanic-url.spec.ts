/* eslint-disable jest/valid-expect-in-promise */
describe('dynamic url', () => {
  // Question: can we set a different baseUrl in a before block?
  // setting baseUrl for it block works, no support for before block
  // if using Cypress.config, the value gets sets for the entire test suite
  // what can we do?

  it('should use customized baseUrl', { baseUrl: 'https://d1kaucldkbcik4.cloudfront.net' }, () => {
    // cy.then(() => {
    //   Cypress.config('baseUrl', 'https://d1kaucldkbcik4.cloudfront.net');
    // });
    cy.visit('/');
    cy.url().should('contain', 'https://d1kaucldkbcik4.cloudfront.net');
    cy.contains('Test Tour of Heroes');
    cy.url().should('include', 'dashboard');
  });

  it('should use default baseUrl', () => {
    cy.visit('/');
    cy.url().should('contain', 'http://localhost:4200');
    cy.get('.hero').first().click();
    cy.url().should('include', '/heroes/');

    cy.get('.qa-cancel').click();
    cy.url().should('include', '/heroes');
    cy.get('.heroes >').should('have.length', 10);

    cy.get('[routerlink="/dashboard"]').click();
    cy.url().should('include', 'dashboard');
    cy.get('.hero').should('have.length', 4);
  });
});
