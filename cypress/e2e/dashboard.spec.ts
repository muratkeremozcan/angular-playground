/// <reference types="Cypress" />

describe('dashboard', () => {
  before(() => cy.visit('/'));

  it('should default to dashboard', () => {
    cy.contains('Test Tour of Heroes');
    cy.url().should('include', 'dashboard');
  });

  it('should nav to a heroes click and nav to heroes list on cancel, and nav back to dashboard ', () => {
    cy.get('.hero').first().click();
    cy.url().should('include', '/heroes/');

    cy.get('.qa-cancel').click();
    cy.url().should('include', '/heroes');
    cy.get('.heroes >').should('have.length', 10);

    cy.get('[routerlink="/dashboard"]').click();
    cy.url().should('include', 'dashboard');
    cy.get('.hero').should('have.length', 4);
  })

});
