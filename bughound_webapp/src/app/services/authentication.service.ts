import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManagerService } from './manager.service';
import {Subject} from "rxjs/internal/Subject";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ManagerService implements OnInit {

  token = null;
  public isConnected = new Subject<any>();

  constructor(protected http: HttpClient) {
    super(http);
  }

  ngOnInit() {
  }

  public login(content) {
    return this.post('/auth/login/', content);
  }

  public logout() {
    localStorage.removeItem('bughound-token');
    this.post('/auth/logout/', {}).subscribe(res => {
      this.isConnected.next(false);
    });
  }

  public getToken() {
    return localStorage.getItem('bughound-token');
  }

  public setToken(token) {
    localStorage.setItem('bughound-token', token);
    this.isConnected.next(true);
  }


  public isLogged() {
    if (this.getToken() == '' || this.getToken() == null) {
      return false;
    }
    return true;
  }
}
