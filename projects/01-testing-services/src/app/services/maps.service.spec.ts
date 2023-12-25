import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let mapService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    mapService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapService).toBeTruthy();
  });

  describe('Test fot getCurrentPosition method', () => {
    it('should set coordinates in "center" variable', () => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (successFn) => {
          const mockGeolocation: GeolocationPosition = {
            coords: {
              accuracy: 0,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              latitude: 1000, // <---
              longitude: 2000, // <---
              speed: 0,
            },
            timestamp: 0,
          };

          successFn(mockGeolocation);
        },
      );

      mapService.getCurrentPosition();

      expect(mapService.center).toEqual({ lat: 1000, lng: 2000 });
    });
  });
});
