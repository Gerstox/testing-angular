import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { environment } from 'src/environments/environment.development';
import { TokenService } from '../services/token.service';

describe('TokenInterceptor', () => {
  let httpController: HttpTestingController;
  let httpClient: HttpClient;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenInterceptor,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });

    httpController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header', () => {
    const token = 'my-auth-token';
    spyOn(tokenService, 'getToken').and.returnValue(token);

    const url = `${environment.API_URL}/api/v1/products`;
    httpClient.get(url)
      .subscribe((data) => {
        expect(data).toBeTruthy();
      });

    const req = httpController.expectOne(url);
    expect(req.request.headers.has('Authorization')).toEqual(true);
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
  });

});
