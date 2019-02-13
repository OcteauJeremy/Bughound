import { Injectable } from '@angular/core';
import {ManagerService} from './manager.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends ManagerService {

  constructor(protected http: HttpClient) {
    super(http);
  }


  listEmployees() {
    return this.get('/employees/');
  }

  createEmployee(employee) {
    return this.post('/employees/', employee);
  }

  updateEmployee(employee) {
    return this.put('/employees/' + employee.id + '/', employee);
  }
}
