import { BannerComponent } from './banner.component';

describe('Banner Component', () => {

  beforeEach(() => {
    cy.mount(BannerComponent, {
    })
  });

  it('loads with a default title', () => {
    cy.get('h1')
      .should('have.text', 'Test Tour of Heroes');
  });

  it('loads with a green font color', () => {
    cy.get('h1')
      .should('have.css', 'color')
      .and('eq', 'rgb(0, 128, 0)');
  })
});
