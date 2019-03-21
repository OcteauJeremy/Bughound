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

    constructor(protected http: HttpClient, protected cookieService: CookieService) {
        super(http, cookieService);
    }

    ngOnInit() {
    }

    public login(content) {
        return this.post('/auth/login/', content);
    }

    public logout() {
        this.post('/auth/logout/', {}).subscribe(res => {
            this.isConnected.next(false);
            this.cookieService.delete('bughound-user');
            this.cookieService.delete('bughound-token');
        });
    }

    retrieveCookie() {
        const user = this.cookieService.get('bughound-user');
        if (user) {
            this.user = JSON.parse(user);
        }
    }


    public setUser(user) {
        this.cookieService.delete('bughound-user');
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
        this.cookieService.delete('bughound-token');
        this.cookieService.set('bughound-token', token);
        this.isConnected.next(true);
    }

    public setId(id) {
        this.cookieService.set('bughound-id', id);
    }

    public isAdmin() {
        if (this.user.is_superuser) {
            return true;
        }
        return false;
    }

    public isEmployee() {
        for (const group of this.user.groups) {
            if (group.name == 'Employee') {
                return true;
            }
        }
        return false;
    }

    public isDevelopper() {
        for (const group of this.user.groups) {
            if (group.name == 'Developer') {
                return true;
            }
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

        if (this.user && this.user.is_superuser) {
            return true;
        }

        if (typeof groups == 'string') {
            groups = [groups]
        }

        let validateGroups = 0;
        for (const auth of groups) {
            for (const group of this.user.groups) {
                if (group.name == auth.name) {
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
