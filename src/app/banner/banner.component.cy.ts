import { BannerComponent } from './banner.component';

describe('Banner Component', () => {
  beforeEach(() => {
    cy.mount(BannerComponent, {
      componentProperties: {
        title: 'This is a test'
      }
    });
  });

  it('loads with a default title', () => {
    cy.get('h1').should('have.text', 'This is a test');
  });

  it('loads with a green font color', () => {
    cy.get('h1').should('have.css', 'color').and('eq', 'rgb(0, 128, 0)');
  });
});
