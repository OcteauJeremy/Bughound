import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
      this.userService.getGroups().subscribe(res => {
          this.groups = res;
          this.selectedGroup = this.groups[0];
      });
  }

  createUser() {
      this.user.group_id = this.selectedGroup.id;
      if (this.user.first_name == "" || this.user.last_name == "" || 
      this.user.password1 == "" || this.user.username == "") {
        this.toastr.error('Missing field');
      }
      
    this.userService.createUser(this.user).subscribe(res => {
        this.toastr.success('User created');
        this.router.navigate(['/dashboard/users/'])
    });
  }

}