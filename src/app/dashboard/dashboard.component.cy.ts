import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../in-memory-data.service';

describe('Dashboard Component', () => {
  beforeEach(() => {
    cy.mount(DashboardComponent, {
      imports: [
        HttpClientTestingModule,
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })
      ]
    });
  });

  it('Load with a title and highlight', () => {
    cy.get('[data-cy="page-title"]')
      .should('have.text', 'No Heroes')
      .should('have.css', 'background-color')
      .and('be.colored', 'lightgrey');
  });

  it('should show the top heroes after OnInit', () => {
    cy.get('[data-cy="page-title"]').should('have.text', 'Top 4 Heroes');

    cy.get('dashboard-hero').should('have.length', 4);
  });
});
