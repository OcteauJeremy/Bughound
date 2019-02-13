import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bughound';

  employee = {
    name: '',
    username: '',
    password: '',
    user_level: 0
  };

  modeEdit = false;

  employees: any;

  constructor(private employeeService: EmployeeService) {

  }

  ngOnInit() {
    this.employeeService.listEmployees().subscribe(res => {
      this.employees = res;
    });
  }

  submit() {
    this.employeeService.createEmployee(this.employee).subscribe(res => {
      this.employee = {
        name: '',
        username: '',
        password: '',
        user_level: 0
      };

      this.employeeService.listEmployees().subscribe(res => {
        this.employees = res;
      });
    });
  }

  editEmployee(employee) {
    this.modeEdit = true;
    this.employee = employee;
  }


  updateEmployee() {
    this.employeeService.updateEmployee(this.employee).subscribe(res => {
      this.employees = res ;
      this.modeEdit = false;
      this.employeeService.listEmployees().subscribe(res2 => {
        this.employees = res2;
      });
    });
  }

  cancelEdit() {
    this.modeEdit = false;
    this.employee = {
      name: '',
      username: '',
      password: '',
      user_level: 0
    };
  }
}

