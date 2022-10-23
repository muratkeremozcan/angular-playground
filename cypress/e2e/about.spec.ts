describe('about', () => {

  before('visit about', () => {
    cy.visit('/');
    cy.get('[routerlink="/about"]').click();
    cy.url().should('include', '/about');
    cy.contains('Quote of the day');
  });

  it('should get a different quote on next', () => {
    cy.get('.twain > i').then(initialQuote => {
      cy.get('button').click();

      cy.get('.twain > i').should('not.contain', '...');
      cy.get('.twain > i').should('not.contain', initialQuote);
    })
  });
});
