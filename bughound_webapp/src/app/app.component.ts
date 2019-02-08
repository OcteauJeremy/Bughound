import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bughound';
  employee=[];

  submit(){
    this.employee.push()
    this.employee.toString()
  }
}
