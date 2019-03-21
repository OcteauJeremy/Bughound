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
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password1: '',
        password2: '',
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
        if (this.user.first_name.trim() == '' || this.user.last_name.trim() == '' ) {
            this.toastr.error('The fields First Name and Last Name can\'t be blank.');
            return ;
        }

        this.userService.createUser(this.user).subscribe(res => {
            this.toastr.success('User created');
            this.router.navigate(['/dashboard/users/'])
        }, err => {
            const an_error = this.getError(err.error);
            this.toastr.error(an_error['message'], an_error['title']);
        });
    }

    getError(err) {
        const key = Object.keys(err)[0];
        const message = err[key];

        const trad_key = {
            'password1': 'Password',
            'password2': 'Confirm Password',
            'non_fields_error': 'Password'
        };

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

}
