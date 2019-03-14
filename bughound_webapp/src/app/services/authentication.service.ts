import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManagerService } from './manager.service';
import { Subject } from 'rxjs/internal/Subject';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ManagerService implements OnInit {

    token = null;
    user = null;
    public isConnected = new Subject<any>();

    constructor(protected http: HttpClient, private cookieService: CookieService) {
        super(http);
    }

    ngOnInit() {
    }

    public login(content) {
        return this.post('/auth/login/', content);
    }

    public logout() {
        this.post('/auth/logout/', {}).subscribe(res => {
            this.isConnected.next(false);
        });
    }

    retrieveCookie() {
        this.user = JSON.parse(this.cookieService.get('bughound-user'));
    }


    public setUser(user) {
        this.cookieService.set('bughound-user', JSON.stringify(user));
        this.user = user;
        this.isConnected.next(true);
    }

    public getUser() {
        return this.user;
    }

    public getToken() {
        return this.cookieService.get('bughound-token');
    }

    public setToken(token) {
        this.cookieService.set('bughound-token', token);
        this.isConnected.next(true);
    }

    public setId(id) {
        this.cookieService.set('bughound-id', id);
    }

    public isAdmin() {
        if (this.user.is_superuser)
            return true;
        return false;
    }

    public isEmployee() {
        for (let group of this.user.groups) {
            if (group.name == 'Employee')
                return true;
        }
        return false;
    }

    public isDevelopper() {
        for (let group of this.user.groups) {
            if (group.name == 'Developer')
                return true;
        }
        return false;
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
