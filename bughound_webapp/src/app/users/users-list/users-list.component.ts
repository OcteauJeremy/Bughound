import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import 'rxjs/Rx' ;

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {


    params_page = {
        page_size: 10,
        page: 1
    };
    users = null;


    constructor(private router: Router, private userService: UserService, public dialog: MatDialog,
                private toastr: ToastrService) {
    }

    openDialogDeleteUser(user): void {
        const dialogRef = this.dialog.open(DialogConfirmDeleteUser, {
            width: '550px',
            data: {user: user}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.deleteUser(result).subscribe(res => {
                    this.params_page = {
                        page_size: 10,
                        page: 1
                    };
                    this.loadUsers();
                    this.toastr.success('User ' + result.first_name + ' ' + result.last_name + ' deleted.');
                });
            }
        });
    }

    ngOnInit() {
        this.loadUsers()
    }

    navigateToUrl(url) {
        this.router.navigate(['/dashboard/users/' + url]);
    }

    loadUsers() {
        this.userService.getUsers(this.params_page).subscribe(res => {
            this.users = res;
        });
    }

    getUserRole(user) {
        return user.groups.map(e => e.name).join(',');
    }

    downloadFile(data) {
        const blob = new Blob([data], {type: 'text/plain'});

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'users-export.xml';
        link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

        setTimeout(function () {
            window.URL.revokeObjectURL(data);
            link.remove();
        }, 100);
    }

    exportResults(type) {
        this.userService.exportUsers({type: type}).subscribe(res => {
            if (type == 'CSV') {
                const csvList = res.result.split('#');
                const headers = csvList.shift().split(',');

                const options = {
                    headers: headers,
                };

                const finalData = [];
                for (const row of csvList) {
                    const dataSplitted = {};
                    const rowSplitted = row.split(',');

                    rowSplitted.forEach((val, idx) => {
                        dataSplitted[headers[idx]] = val;
                    });
                    finalData.push(dataSplitted);
                }
                new Angular5Csv(finalData, 'users-export', options);
            } else {
                this.downloadFile(res.result);
            }

        });
    }
}

@Component({
    selector: 'app-dialog-confirm-delete-user',
    templateUrl: 'dialog-confirm-delete-user.html',
})
export class DialogConfirmDeleteUser {

    constructor(
        public dialogRef: MatDialogRef<DialogConfirmDeleteUser>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
