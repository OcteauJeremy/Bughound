import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {

    user = null;
    groups = [];
    selectedGroup = null;

  constructor(private route: ActivatedRoute, private userService: UserService, private toastr: ToastrService) { }

    ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');

      this.userService.getUser(id).subscribe(user => {
          this.user = user;
          this.userService.getGroups().subscribe(groups => {
              this.groups = groups;
              this.selectedGroup = this.user.groups[0];
          });
      });

    }

    updateUser() {

      this.user.groups = [this.selectedGroup];

      this.userService.modifyUser(this.user).subscribe(res => {
          this.user = res;
          this.toastr.success('User modified.');
      });
    }

}
