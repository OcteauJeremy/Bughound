import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { getChoiceFromValue } from '../bugs-utils';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-bugs-list',
    templateUrl: './bugs-list.component.html',
    styleUrls: ['./bugs-list.component.scss']
})
export class BugsListComponent implements OnInit {

    params_page = {
        page_size: 10,
        page: 1
    };
    bugs = null;

    getName = getChoiceFromValue;

    constructor(private router: Router, private bugService: BugService, public dialog: MatDialog, private toastr: ToastrService,
                private as: AuthenticationService) {
    }

    ngOnInit() {
        this.loadBugs()
    }

    navigateToUrl(url) {
        this.router.navigate(['/dashboard/bugs/' + url]);
    }

    loadBugs() {
        this.bugService.listBugs(this.params_page).subscribe(res => {
            this.bugs = res;
            // for (let bug of this.bugs.results) {
            //     bug.checked = false;
            // }
        });
    }

    canDelete() {
        return this.as.isAdmin();
    }

    isDevelopper() {
        return this.as.isDevelopper();
    }

    isAdmin() {
        return this.as.isAdmin();
    }

    checkedBugs() {
        for (let bug of this.bugs.results) {
            if (bug.checked) {
                return false;
            }
        }
        return true;
    }

    assignBugs() {
        for (let bug of this.bugs.results) {
            if (bug.checked) {
                bug['assigned_to'] = this.as.getUser();
                this.bugService.updateBug(bug).subscribe(res => {
                    this.toastr.success('Bug ' + bug.id + ' assigned');
                    bug = res;
                })
            }
        }
    }

    openDialogDeleteBug(bug): void {
        const dialogRef = this.dialog.open(DialogConfirmDeleteBug, {
            width: '550px',
            data: {bug: bug}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.bugService.deleteBug(bug).subscribe(res => {
                    this.params_page = {
                        page_size: 10,
                        page: 1
                    };
                    this.loadBugs();
                    this.toastr.success('Bug ' + result.name + ' deleted.');
                });
            }
        });
    }
}

@Component({
    selector: 'app-dialog-confirm-delete-bug',
    templateUrl: 'dialog-confirm-delete-bug.html',
})
export class DialogConfirmDeleteBug {

    constructor(
        public dialogRef: MatDialogRef<DialogConfirmDeleteBug>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
