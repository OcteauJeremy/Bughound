import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManagerService } from './manager.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends ManagerService {
    constructor(protected http: HttpClient, protected cookieService: CookieService) {
        super(http, cookieService);
    }

    listPrograms(params) {
        return this.getQuery('/programs/', params);
    }

    createProgram(program) {
        return this.post('/programs/', program);
    }

    getProgram(id) {
        return this.get('/programs/' + id);
    }

    deleteProgram(program) {
        return this.delete('/programs/' + program.id);
    }

    updateProgram(program) {
        return this.put('/programs/' + program.id, program);
    }

}
