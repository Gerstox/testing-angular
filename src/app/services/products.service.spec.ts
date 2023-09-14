import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProductsService } from "./products.service";
import { environment } from "../../environments/environment.development";
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
import { HTTP_INTERCEPTORS, HttpStatusCode } from "@angular/common/http";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { TokenService } from "./token.service";

describe('ProductService', () => {

  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('Should be create', () => {
    expect(productService).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {

    it('Should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(2);
      const token = '123';
      spyOn(tokenService, 'getToken').and.returnValue(token);

      productService.getAllSimple()
        .subscribe((data) => {
          expect(data.length).toEqual(mockData.length);
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer ${token}`);
      req.flush(mockData);
    });

  });

  describe('Tests for getAll', () => {

    it('Should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);

      productService.getAll()
        .subscribe((data) => {
          expect(data.length).toEqual(mockData.length);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne({method: 'GET', url: url});
      req.flush(mockData);
    });

    it('Should return a product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100. // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200. // 200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0. // 0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100. // -100 * .19 = 0
        },
      ];

      productService.getAll()
        .subscribe((data) => {
          expect(data.length).toEqual(mockData.length);
          expect(data[0].taxes).toEqual(19);
          expect(data[1].taxes).toEqual(38);
          expect(data[2].taxes).toEqual(0);
          expect(data[3].taxes).toEqual(0);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products`;
      const request = httpController.expectOne(url);
      request.flush(mockData);

    });

    it('Should send query params with limit 7 and offset 9', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 7;
      const offset = 9;

      productService.getAll(limit, offset)
        .subscribe((data) => {
          expect(data.length).toEqual(mockData.length);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });

    it('Should send query params with limit 0 and offset 0', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 0;
      const offset = 0;

      productService.getAll(limit, offset)
        .subscribe((data) => {
          expect(data.length).toEqual(mockData.length);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(null);
      expect(params.get('offset')).toEqual(null);
    });

  });

  describe('Test for create', () => {

    it('Should return a new product', (doneFn) => {

      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'Description',
        categoryId: 12
      };

      productService.create({...dto})
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('Test for update', () => {
    it('Should update a product', (doneFn) => {
      const mockData = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'New Product'
      };

      const productId = '1';

      productService.update(productId, {...dto})
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
    });
  });

  describe('Test for delete', () => {

    it('Should delete a product', (doneFn) => {

      const mockData = true;
      const productId = '1';

      productService.delete(productId)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('Test for getOne', () => {
    it('Should return a product', (doneFn) => {
      const mockData = generateOneProduct();
      const productId = '1';

      productService.getOne(productId)
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          doneFn();
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.method).toEqual('GET');
    });

    it('Should return the right message when status code is 404', (doneFn) => {
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      };

      productService.getOne(productId)
        .subscribe({
          error: (error) => { // Error
            // Assert
            expect(error).toEqual('El producto no existe'),
            doneFn();
          }
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('Should return the right message when status code is 401', (doneFn) => {
      const productId = '1';
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
      };

      productService.getOne(productId)
        .subscribe({
          error: (error) => {
            expect(error).toEqual('No estas permitido'),
            doneFn();
          }
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('Should return the right message when status code is 409', (doneFn) => {
      const productId = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      };

      productService.getOne(productId)
        .subscribe({
          error: (error) => {
            expect(error).toEqual('Algo esta fallando en el server'),
            doneFn();
          }
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('Should return the right message when status code is unknown', (doneFn) => {
      const productId = '1';
      const msgError = 'unknown message';
      const mockError = {
        status: 1000,
        statusText: msgError
      };

      productService.getOne(productId)
        .subscribe({
          error: (error) => {
            expect(error).toEqual('Ups algo salio mal'),
            doneFn();
          }
        });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });

});
