describe('heroes', () => {

  before('visit heroes', () => {
    cy.visit('/');
    cy.get('[routerlink="/heroes"]').click();
    cy.url().should('include', '/heroes');
    cy.get('.heroes >').should('have.length', 10);
  });

  const editedHero = 'edited hero';

  it('should nav to a hero on click and edit the name, then cancel', () => {
    cy.get('.heroes >').first().click();
    cy.url().should('include', '/heroes/');

    cy.get('#name').clear().type(editedHero);
    cy.get('.qa-cancel').click();
    cy.url().should('include', '/heroes');

    cy.get('.heroes >').should('not.contain', editedHero);
  })

  it('should nav to a hero on click and edit the name, then confirm', () => {
    cy.get('.heroes >').first().click();
    cy.url().should('include', '/heroes/');

    cy.get('#name').clear().type(editedHero);
    cy.get('.qa-save').click();
    cy.url().should('include', '/heroes');

    cy.get('.heroes >').should('contain', editedHero);

    cy.log('reset state');
    cy.reload();
    cy.get('.heroes >').should('not.contain', editedHero);
  })

});
