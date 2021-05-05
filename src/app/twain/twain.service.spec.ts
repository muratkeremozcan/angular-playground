import { SpectatorHttp, createHttpFactory, HttpMethod } from '@ngneat/spectator/jest';
import { TwainService } from './twain.service';
import { Quote } from './quote';

describe('TwainService', () => {
  let spectator: SpectatorHttp<TwainService>;
  let twainService: TwainService;
  let assertion;
  let expectedQuote: Quote;

  const createHttp = createHttpFactory(TwainService);

  beforeEach(() => {
    spectator = createHttp();
    twainService = spectator.service;

    expectedQuote = {
      id: 1,
      quote: 'abc'
    };
  });

  it('should getQuote', () => {
    twainService.getQuote().subscribe((quote) => (assertion = quote), fail);

    spectator.expectOne('api/quotes/1', HttpMethod.GET).flush(expectedQuote);

    expect(assertion).toEqual(expectedQuote.quote);

    expect(expectedQuote).toMatchSnapshot();
  });
});
