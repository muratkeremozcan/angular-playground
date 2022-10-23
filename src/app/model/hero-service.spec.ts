import { SpectatorHttp, createHttpFactory, HttpMethod } from '@ngneat/spectator/jest';
import { Hero } from './hero';
import { HeroService } from './hero.service';

// [3] testing http
// setup the http (much leaner with spectator, and similar to other spectator setups) (3.1)
// prep hardcoded data, initiate the client request and setup the assertion that will happen, match the url w/ expectOne- for spectator add a 2nd arg HttpMethod.GET/POST etc. (3.2)
// with spectator, afterEach verify() is not needed, flush is also not needed (3.3)  flush is only needed for concurrent get requests https://www.npmjs.com/package/@ngneat/spectator#testing-services
// in error testing, define the error response and bypass the success case (3.4)
// testing save requests PUTs and POSTs and DELETEs: test the method type and for PUT and POST request body that is going out from the client ' (3.6)

describe('[3] Testing Http', () => {
  // setup is much cleaner with spectator(3.1)
  let spectator: SpectatorHttp<HeroService>;
  let heroService: HeroService;
  const createHttp = createHttpFactory(HeroService);

  // for the hardcoded data that is shared between the tests
  let expectedHeroes: Hero[];
  let hero: Hero;
  let assertion;

  beforeEach(() => {
    spectator = createHttp();
    heroService = spectator.service;
  });

  describe('GET requests', () => {
    beforeEach(() => {
      // (3.2.1) prepare hardcoded data that will be used as the response
      expectedHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
      ] as Hero[];
    });

    it('(3.2.2) initiate the client request and setup the assertion that will happen,(3.2.3) match the url w/ spectator.expectOne, (3.2.4) flush the response and assert that the set value matches the expected value', () => {
      // (3.2.2) initiate the client request, and setup the assertion that will happen once the observable is fulfilled
      heroService.getHeroes().subscribe(
        (heroes) => (assertion = heroes),
        (err) => { throw new Error() } // the error case of the observable
      );

      // (3.2.3) expect that a single request has been made which matches the given URL, using spectator.expectOne
      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.GET);

      // (3.2.4) flush the response and assert that the set value matches the expected value
      req.flush(expectedHeroes);
      expect(assertion).toEqual(expectedHeroes);
      expect(assertion).toMatchSnapshot(); // could also supplement http testing with snapshot testing
    });

    it('cover the Empty Response Case', () => {
      heroService.getHeroes().subscribe((heroes) => (assertion = heroes), (err) => { throw new Error() });

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.GET);
      req.flush([]);

      expect(assertion).toHaveLength(0);
    });

    it('(3.4) in error testing, define the error response and bypass the success', () => {
      const msg = 'Deliberate 404';

      heroService.getHeroes().subscribe(
        (heroes) => { throw new Error('expected to fail') },
        (error) => (assertion = error.message) // 3.4.0 in error testing, define the error response and bypass the success case
      );

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.GET);
      req.flush(msg, { status: 404, statusText: 'Not Found' });

      expect(assertion).toContain(msg);
      expect(assertion).toMatchSnapshot();
    });
  });

  describe('PUT requests', () => {
    beforeEach(() => {
      hero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing PUTs: test the method type and request body that is going out from the client', () => {
      heroService.updateHero(hero).subscribe((data) => (assertion = data), (err) => { throw new Error() });

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.PUT);

      expect(req.request.body.id).toBe(1);
      expect(req.request.body.name).toBe('A');

      req.flush(hero);
      expect(assertion).toEqual(hero);
      expect(assertion).toMatchSnapshot();
    });

    it('cover the Error Case, same as the GET scenario in (3.4)', () => {
      const msg = 'Deliberate 404';

      heroService.updateHero(hero).subscribe(
        (heroes) => { throw new Error('expected to fail') },
        (error) => (assertion = error.message) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.PUT);

      req.flush(msg, { status: 404, statusText: 'Not Found' });
      expect(assertion).toContain(msg);
      expect(assertion).toMatchSnapshot();
    });
  });

  describe('POST requests', () => {
    beforeEach(() => {
      hero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing POSTs: test the method type and request body that is going out from the client', () => {
      heroService.addHero(hero).subscribe((data) => (assertion = data), (err) => { throw new Error() });

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.POST);

      expect(req.request.body.id).toBe(1);
      expect(req.request.body.name).toBe('A');

      req.flush(hero);
      expect(assertion).toEqual(hero);
    });

    it('cover the Error Case, same as the GET scenario in (3.4)', () => {
      const msg = 'Deliberate 404';

      heroService.addHero(hero).subscribe(
        (heroes) => { throw new Error('expected to fail') },
        (error) => (assertion = error.message) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.POST);

      req.flush(msg, { status: 404, statusText: 'Not Found' });
      expect(assertion).toContain(msg);
    });
  });

  describe('DELETE requests', () => {
    beforeEach(() => {
      hero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing DELETE: test the method type', () => {
      heroService.deleteHero(hero).subscribe((data) => (assertion = data), (err) => { throw new Error() });

      const req = spectator.expectOne(`${heroService.heroesUrl}/1`, HttpMethod.DELETE);
      req.flush([]);
      expect(assertion).toEqual([]);
    });

    it('cover the Error Case, same as the GET scenario in (3.4)', () => {
      const msg = 'Deliberate 404';

      heroService.deleteHero(hero).subscribe(
        (heroes) => { throw new Error('expected to fail')},
        (error) => (assertion = error.message) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      const req = spectator.expectOne(`${heroService.heroesUrl}/1`, HttpMethod.DELETE);

      req.flush(msg, { status: 404, statusText: 'Not Found' });
      expect(assertion).toContain(msg);
    });
  });
});
