import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ValueService ]
    })
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('Should return "my value"', () => {
      expect(service.getValue()).toBe('my value');
    });
  });

  describe('Tests for setValue', () => {
    it('Should change the value', () => {
      expect(service.getValue()).toBe('my value');
      service.setValue('change');
      expect(service.getValue()).toBe('change');
    });
  });

  describe('Tests for getPromiseValue', () => {
    it('Should return "Promise value" from promise with then', (doneFn) => {
      service.getPromiseValue()
      .then((value) => {
        expect(value).toBe('Promise value');
        doneFn();
      })
    });

    it('Should return "Promise value" from promise with async/await', async () => {
      const value = await service.getPromiseValue();
      expect(value).toBe('Promise value');
    });
  });

  // describe('Tests for getObservableValue', () => {
  //   it('Should change the value', () => {
  //     expect(service.getValue()).toBe('my value');
  //     service.setValue('change');
  //     expect(service.getValue()).toBe('change');
  //   });
  // });

});
