import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from '../../environments/environment.development';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService
      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('Test for login', () => {
    it('Should return a token', (doneFn)=> {
      const mockData: Auth = {
        access_token: '121212',
      };
      const email = 'gers@email.com';
      const password = '121212';

      authService.login(email, password)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('Should call saveToken function', (doneFn)=> {
      const mockData: Auth = {
        access_token: '121212',
      };
      const email = 'gers@email.com';
      const password = '121212';

      spyOn(tokenService, 'saveToken').and.callThrough();

      authService.login(email, password)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledOnceWith('121212');
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });

});
