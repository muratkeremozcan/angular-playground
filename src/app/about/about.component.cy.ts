import { AboutComponent } from './about.component';
import { TwainService } from '../twain/twain.service';
import { Observable, of } from 'rxjs';
import { QuoteServiceModel } from '../twain/quote.service.model';
import { Injectable } from '@angular/core';

@Injectable()
class MockTwainService implements QuoteServiceModel {
  getQuote(): Observable<string> {
    return of('Be Inspired!');
  }
}

describe('About Component', () => {
  // Mount the component before the start of the test
  beforeEach(() => {
    cy.mountStandalone(AboutComponent, {
      providers: [{ provide: TwainService, useClass: MockTwainService }]
    });
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
