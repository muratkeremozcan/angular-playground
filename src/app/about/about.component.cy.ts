import { AboutComponent } from './about.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AboutComponent', () => {

  // Mount the component before the start of the test
  beforeEach(() => {
    cy.mount(AboutComponent, {
      imports: [HttpClientTestingModule]
    });
  });

  it('mounts', () => {
   cy.get('[data-cy=page-title]')
     .should('have.text', 'About')
     .should('have.css', 'background-color')
     .and('eq', 'rgb(135, 206, 235)');
  });
});
