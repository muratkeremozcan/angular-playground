import { Observable } from 'rxjs';

export interface QuoteServiceModel {
  getQuote: () => Observable<string>;
}
