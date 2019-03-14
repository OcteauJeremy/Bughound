import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.scss']
})
export class LoginHomeComponent implements OnInit {

    creditentials = {
        username: 'admin',
        password: 'password'
    };

    constructor(private as: AuthenticationService, private router: Router, private toastr: ToastrService, private userService: UserService) { }

    ngOnInit() {
    }

    login() {
        this.as.login(this.creditentials).subscribe(res => {
            this.toastr.success('Login successful');
            this.as.setToken(res.token);
            this.as.setUser(res.user);
            this.router.navigate(['/dashboard']);
        }, error1 => {
            this.toastr.error('Wrong creditentials');

        });
    }

}
