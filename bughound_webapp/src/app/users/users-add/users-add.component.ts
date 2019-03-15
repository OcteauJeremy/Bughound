import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-users-add',
    templateUrl: './users-add.component.html',
    styleUrls: ['./users-add.component.scss']
})
export class UsersAddComponent implements OnInit {

    user = {
        first_name: 'Toto',
        last_name: 'oklm',
        username: 'eqmfqmf',
        email: 'qwdq@tototo.com',
        password1: '12qw34er56ty',
        password2: '12qw34er56ty',
        group_id: null
    };

    groups = [];
    selectedGroup = null;

    constructor(private userService: UserService, private toastr: ToastrService, private router: Router,
                private renderer: Renderer2, private el: ElementRef){
    }

    ngOnInit() {
        this.userService.getGroups().subscribe(res => {
            this.groups = res;
            this.selectedGroup = this.groups[0];
        });
    }

    createUser() {
        this.user.group_id = this.selectedGroup.id;
        if (this.user.first_name == '' || this.user.last_name == '' ||
            this.user.password1 == '' || this.user.username == '') {
            this.toastr.error('Missing field');
        }

        this.userService.createUser(this.user).subscribe(res => {
            this.toastr.success('User created');
            this.router.navigate(['/dashboard/users/'])
        }, err => {
            const an_error = this.getError(err);
            this.trigger_error_form(err.error);
            this.toastr.error(an_error['message'], an_error['title']);
        });
    }

    getError(err) {
        const key = Object.keys(err.error)[0];
        const message = err.error[key];

        const trad_key = {};

        let title = key;

        if (title in trad_key) {
            title = trad_key[key]
        } else {
            title = key;
        }

        return {
            message: message,
            title: title.toUpperCase()
        };
    }

    trigger_error_form(errors) {

        let inputs = this.el.nativeElement.querySelectorAll('.input-login');

        for (let input of inputs) {
            this.renderer.removeClass(input, 'error-input');

        }

        for (let key in errors) {

            if (key == 'password2') {
                continue;
            }

            let input = this.el.nativeElement.querySelector('#' + key);
            this.renderer.addClass(input, 'error-input');
        }
    }

}
