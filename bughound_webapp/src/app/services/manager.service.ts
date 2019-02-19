import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  public baseUrl = environment.apiUrl;
  // public cookieService: CookieService;

  constructor(protected http: HttpClient) {
    // this.cookieService = new CookieService();
  }

  static generateHeadersAuth(headers: HttpHeaders) {
    const token = localStorage.getItem('bughound-token');


    if (token) {
      headers = headers.append('x-access-token', token);
    }
    return headers;
  }

  get(url, disableHeaders = false) {
    let headers = new HttpHeaders();

    headers = ManagerService.generateHeadersAuth(headers);

    return this.http.get<any>(this.baseUrl + url, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }

  getQuery(url, queryParams) {
    let headers = new HttpHeaders();

    headers = ManagerService.generateHeadersAuth(headers);

    return this.http.get<any>(this.baseUrl + url, {
      params: queryParams,
      headers: headers
    });
  }

  post(url, body) {
    let headers = new HttpHeaders();

    headers = ManagerService.generateHeadersAuth(headers);

    return this.http.post<any>(this.baseUrl + url, body, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }

  put(url, body) {
    let headers = new HttpHeaders();

    headers = ManagerService.generateHeadersAuth(headers);

    return this.http.put(this.baseUrl + url, body, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }

  delete(url) {
    let headers = new HttpHeaders();

    headers = ManagerService.generateHeadersAuth(headers);

    return this.http.delete<any>(this.baseUrl + url, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }
}
