import { MasterService, ValueService } from './demo';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { SpectatorService , createServiceFactory } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';

// [2].1 testing services by themselves or with other service dependencies
// (2.1) setup the service and satisfy the TS
// (2.2) use the service
// (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables

// (2.4.0) KEY: with spectator, you can fully mock the dependency using the mocks property (no need for custom mocks unless you need them)
// (2.4.1) inject the service under test and the mock dependency
// (2.4.2) stub the external service's return value, and exercise the main service under test


describe('[2] Testing Services by themselves', () => {
  describe('Testing a service by itself: (2.1) setup the service, (2.2) use the service', () => {
    let valueService: ValueService;

    // (2.1) setup the service... replaces TestBed.configureTestingModule({...}). Mind that the setup is prior to beforeEach block
    const createService = createServiceFactory(ValueService);
    let spectator: SpectatorService<ValueService>;

    beforeEach(() => {
      spectator = createService();
      valueService = spectator.service;
    });

    it('synchronous: should use ValueService getValue()', () => {
      expect(valueService.getValue()).toBe('real value');
    });

    // (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
    describe('(2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables', () => {
      describe('waitForAsync() way (I prefer this) ', () => {
        it('waitForAsync() : ValueService.getPromiseValue', waitForAsync(() => {
            valueService
              .getPromiseValue()
              .then((value) => {
                expect(value).toBe('promise value');
                // you can easily apply snapshot testing to services, but it's more appropriate if you're verifying something more than a string
                expect(value).toMatchSnapshot();
              });
          })
        );

        it('waitForAsync() : ValueService.getObservableValue', waitForAsync(() => {
            valueService
              .getObservableValue()
              .subscribe((value) => expect(value).toBe('observable value'));
          })
        );

        it('waitForAsync() : ValueService.getObservableDelayValue', waitForAsync(() => {
            valueService
              .getObservableDelayValue()
              .subscribe((value) => expect(value).toBe('observable delay value'));
          })
        );
      });

      describe('fakeAsync() way', () => {
        it('fakeAsync() : Value.getPromiseValue ', fakeAsync(() => {
          let value: any;
          valueService.getPromiseValue().then((val) => (value = val));
          tick(); // Trigger JS engine cycle until all promises resolve.
          expect(value).toBe('promise value');
        }));

        it('fakeAsync() : Value.getObservableValue. KEY: using tick() for control ', fakeAsync(() => {
          let value: any;
          valueService.getObservableValue().subscribe((val) => (value = val));
          tick(); // Trigger JS engine cycle until all promises resolve.
          expect(value).toBe('observable value');
        }));

        it('fakeAsync() : Value.getObservableDelayValue. KEY: tick(ms) by the delay amount ', fakeAsync(() => {
          let value: any;
          valueService.getObservableDelayValue().subscribe((val) => (value = val));
          tick(10); // Trigger JS engine cycle until all promises resolve.
          expect(value).toBe('observable delay value');
        }));
      });

      it('done() : Almost never use done() over fakeAsync() or waitForAsync()  . ValueService.getObservableDelayValue', (done) => {
        valueService.getObservableDelayValue().subscribe((value) => {
          expect(value).toBe('observable delay value');
          done();
        });
      });

    });
  });


  describe(`Testing a service with a service dependency: (2.4.0) KEY: with spectator, you can fully mock the dependency using the mocks property,
  (2.4.1) inject the service under test and the mock dependency`, () => {
    let masterService: MasterService;
    let spectator: SpectatorService<MasterService>;
    let valueServiceSpy;
    let stubValue;

    const createService = createServiceFactory({
      service: MasterService,
      mocks: [ValueService] // (2.4.0) KEY: with spectator, you can fully mock the dependency using the mocks property
    });

    beforeEach(() => {
      spectator = createService();
      // (2.4.1) inject the service under test and the mock dependency
      masterService = spectator.inject(MasterService);
      valueServiceSpy = spectator.inject(ValueService);

      stubValue = 'stub value';
      // (2.4.2) stub the external service's return value, and exercise the main service under test
      jest.spyOn(valueServiceSpy, 'getValue').mockReturnValue(stubValue);
      // jest.spyOn(valueServiceSpy, 'getValue').mockImplementation(() => stubValue); // same
      // valueServiceSpy.getValue.mockImplementation(() => stubValue); // same
    });

    it('(2.4.2) stub the external service\'s return value, and exercise the main service under test', () => {
      expect(masterService.getValue()).toBe(stubValue);
      expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
      // expect(valueServiceSpy.getValue).toHaveBeenCalled(); // ^ same
      expect(valueServiceSpy.getValue).toHaveReturnedWith(stubValue);

      // you could add snapshot testing, but better if the value we are checking for is more than a string
      expect(masterService.getValue()).toMatchSnapshot();
    });

  });

  describe(`ngMocks MockProvider comparison`, () => {
    let masterService: MasterService;
    let spectator: SpectatorService<MasterService>;
    const stubValue = 'stub value';

    const createService = createServiceFactory({
      service: MasterService,
      // instead of the mocking and spying on the external service (2.4.0, 2.4.2), we can use this MockProvider pattern
      // however, if we want to spy on the external service, this pattern is not the way to do it
      // if we do not want to spy on the external service, this approach is a shortcut since you do not have to inject the service and setup the stub
      providers: [MockProvider(ValueService, {
        getValue: () => stubValue
      })]
    });

    beforeEach(() => {
      spectator = createService();
      // (2.4.1) inject the service under test and the mock dependency
      masterService = spectator.inject(MasterService);
    });

    it('(2.4.2) stub the external service\'s return value, and exercise the main service under test', () => {
      expect(masterService.getValue()).toBe(stubValue);
      // you could still add on snapshot testing here or the above, better if the value we are checking for is more than a string
      expect(masterService.getValue()).toMatchSnapshot();
    });

  });
});
