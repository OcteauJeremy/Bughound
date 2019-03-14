import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class AdminDevelopperGuard implements CanActivate {

    constructor(private as: AuthenticationService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.as.isAdmin() || this.as.isDevelopper();
    }
}
