import { HeroDetailService } from './hero-detail.service';
import { HeroService } from '../model/hero.service';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';

// [2].2 testing services  with other service dependencies
// (2.1) setup the service and satisfy the TS (2.2) use the service
// (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables

// (2.4.0) KEY: with spectator, you can fully mock the dependency using the mocks property (no need for custom mocks unless you need them)
// (2.4.1) inject the service under test and the mock dependency
// (2.4.2) stub the external service's return value, and exercise the main service under test

describe('HeroDetailService', () => {
  let spectator: SpectatorService<HeroDetailService>;
  let heroDetailService: HeroDetailService;
  let heroServiceSpy: HeroService;

  const createService = createServiceFactory({
    service: HeroDetailService,
    // (2.4.0) with spectator, you can fully mock the dependency using the mocks property (no need for custom mocks unless you need them)
    mocks: [HeroService]
  });

  const stubHero = {
    id: 1,
    name: 'abc'
  };

  beforeEach(() => {
    // (2.1) (2.2) setup the service and satisfy the TS
    spectator = createService();
    heroDetailService = spectator.service;

    // (2.4.1) inject the service under test and the mock dependency
    heroDetailService = spectator.inject(HeroDetailService);
    heroServiceSpy = spectator.inject(HeroService);
  });

  it('sanity', () => {
    expect(heroDetailService).toBeTruthy();
    expect(heroDetailService).toMatchSnapshot();
  });

  describe('getHero', () => {
    it(
      'getHero with waitForAsync',
      waitForAsync(() => {
        // (2.4.2) stub the external service's return value, and exercise the main service under test
        jest.spyOn(heroServiceSpy, 'getHero').mockReturnValue(of(stubHero));

        // (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
        heroDetailService.getHero(1).subscribe((value) => {
          expect(heroServiceSpy.getHero).toHaveBeenCalledWith(1);
          expect(value).toEqual(stubHero);
          expect(value).toMatchSnapshot(); // this is a good example of using snapshot testing in services
        });
      })
    );

    it(
      'getHero with waitForAsync, cover the parseInt line',
      waitForAsync(() => {
        jest.spyOn(heroServiceSpy, 'getHero').mockReturnValue(of(stubHero));

        // to cover the source code line "if (typeof id === 'string') {" we pass in a string as the argument
        heroDetailService.getHero('1').subscribe((value) => {
          expect(heroServiceSpy.getHero).toHaveBeenCalledWith(1);
          expect(value).toEqual(stubHero);
          expect(value).toMatchSnapshot();
        });
      })
    );

    it('getHero with fakeAsync alternative', fakeAsync(() => {
      // (2.4.2) stub the external service's return value, and exercise the main service under test
      jest.spyOn(heroServiceSpy, 'getHero').mockReturnValue(of(stubHero));

      let expectedValue;
      // (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
      heroDetailService.getHero(1).subscribe((value) => (expectedValue = value));
      tick();
      expect(heroServiceSpy.getHero).toHaveBeenCalled();
      expect(expectedValue).toEqual(stubHero);
      expect(expectedValue).toMatchSnapshot();
    }));
  });

  describe('saveHero', () => {
    it(
      'saveHero with waitForAsync',
      waitForAsync(() => {
        // (2.4.2) stub the external service's return value, and exercise the main service under test
        jest.spyOn(heroServiceSpy, 'updateHero').mockReturnValue(of(null));

        // (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
        heroDetailService.saveHero(stubHero).subscribe((value) => {
          expect(heroServiceSpy.updateHero).toHaveBeenCalledWith(stubHero);
          expect(value).toBeNull();
          expect(value).toMatchSnapshot();
        });
      })
    );
    it('saveHero with fakeAsync', fakeAsync(() => {
      // (2.4.2) stub the external service's return value, and exercise the main service under test
      jest.spyOn(heroServiceSpy, 'updateHero').mockReturnValue(of(null));

      let expected;

      // (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
      heroDetailService.saveHero(stubHero).subscribe((value) => (expected = value));

      expect(heroServiceSpy.updateHero).toHaveBeenCalledWith(stubHero);
      expect(expected).toBeNull();
      expect(expected).toMatchSnapshot();
    }));
  });
});
