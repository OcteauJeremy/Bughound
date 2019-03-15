import { Injectable } from '@angular/core';
import { ManagerService } from './manager.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class BugService extends ManagerService {
    constructor(protected http: HttpClient, protected cookieService: CookieService) {
        super(http, cookieService);
    }

    listBugs(params) {
        return this.getQuery('/bugs/', params);
    }

    createBug(bug) {
        return this.post('/bugs/', bug);
    }

    getBug(id) {
        return this.get('/bugs/' + id);
    }

    deleteBug(bug) {
        return this.delete('/bugs/' + bug.id);
    }

    updateBug(bug) {
        return this.put('/bugs/' + bug.id, bug);
    }

    getAreas() {
        return this.get('/areas/');
    }

    exportBugs(params) {
        return this.getQuery('/export_results/', params, {
            'content-type': 'text/csv',
        });
    }
}
