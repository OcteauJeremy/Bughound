import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManagerService } from './manager.service';
import {Subject} from "rxjs/internal/Subject";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ManagerService implements OnInit {

  token = null;
  user = null;
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
      localStorage.removeItem('bughound-id');
    this.post('/auth/logout/', {}).subscribe(res => {
      this.isConnected.next(false);
    });
  }


  public setUser(user) {
      this.user = user;
  }

  public getUser() {
      return this.user;
  }


    public getId() {
        return localStorage.getItem('bughound-id');
    }

    public getToken() {
    return localStorage.getItem('bughound-token');
  }

  public setToken(token) {
    localStorage.setItem('bughound-token', token);
    this.isConnected.next(true);
  }

    public setId(id) {
        localStorage.setItem('bughound-id', id);
    }


  public isLogged() {
    if (this.getToken() == '' || this.getToken() == null) {
      return false;
    }
    return true;
  }

    public hasAuthority(groups) {

      console.log(groups, this.user);
      if (this.user && this.user.is_staff) {
          return true;
      }

      console.log(this.user);

      if (typeof groups == 'string') {
          groups = [groups]
      }

      let validateGroups = 0;
      for (let auth of groups) {
          for (let group of this.user.groups) {
              if (group == auth) {
                  ++validateGroups;
              }
          }
      }

      if (validateGroups == groups.length) {
          return true;
      }

      return false;
  }
}
