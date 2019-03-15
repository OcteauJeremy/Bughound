import { Injectable } from '@angular/core';
import { ManagerService } from './manager.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ManagerService {

  constructor(protected http: HttpClient, protected cookieService: CookieService) {
      super(http, cookieService);
  }

  createUser(body) {
      return this.post('/auth/registration/', body, false);
  }

  getUsers(params) {
      return this.getQuery('/users/', params)
  }

  getUser(id) {
      return this.get('/users/' + id);
  }

  getGroups() {
      return this.get('/users/groups/');
  }

  modifyUser(user) {
      return this.put('/users/' + user.id, user);
  }

  deleteUser(user) {
      return this.delete('/users/' + user.id);
  }
}
