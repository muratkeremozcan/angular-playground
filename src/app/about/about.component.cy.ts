import { AboutComponent } from './about.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('About Component', () => {
  // Mount the component before the start of the test
  beforeEach(() => {
    cy.mount(AboutComponent, {
      imports: [HttpClientTestingModule]
    });
  });

  it('Loads with a title and highlight', () => {
    cy.get('[data-cy=page-title]')
      .should('have.text', 'About')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(135, 206, 235)');
  });
});
