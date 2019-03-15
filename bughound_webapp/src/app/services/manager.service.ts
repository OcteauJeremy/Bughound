import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  public baseUrl = environment.apiUrl;
  // public cookieService: CookieService;

  constructor(protected http: HttpClient, private cookieService: CookieService) {
    // this.cookieService = new CookieService();
  }

  public generateHeadersAuth(headers: HttpHeaders) {
    const token = this.cookieService.get('bughound-token');


    if (token) {
      headers = headers.append('Authorization', 'JWT ' + token);
    }
    return headers;
  }

  get(url, disableHeaders = false) {
    let headers = new HttpHeaders();

    headers = this.generateHeadersAuth(headers);

    return this.http.get<any>(this.baseUrl + url, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }

  getQuery(url, queryParams, supHeader = null) {
    let headers = new HttpHeaders();

    headers = this.generateHeadersAuth(headers);

    if (supHeader != null) {
        for (let key in supHeader) {
            console.log(key, supHeader[key]);
            headers = headers.append(key, supHeader[key]);
        }
    }

    return this.http.get<any>(this.baseUrl + url, {
      params: queryParams,
      headers: headers
    });
  }

  post(url, body, header = true) {
    let headers = new HttpHeaders();

    if (header) {
        headers = this.generateHeadersAuth(headers);
    }

    return this.http.post<any>(this.baseUrl + url, body, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }

  put(url, body) {
    let headers = new HttpHeaders();

    headers = this.generateHeadersAuth(headers);

    return this.http.put(this.baseUrl + url, body, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }

  delete(url) {
    let headers = new HttpHeaders();

    headers = this.generateHeadersAuth(headers);

    return this.http.delete<any>(this.baseUrl + url, {
      headers: headers
    }).pipe(catchError((error: Response | any) => {
      return Observable.throw(error);
    }));
  }
}
