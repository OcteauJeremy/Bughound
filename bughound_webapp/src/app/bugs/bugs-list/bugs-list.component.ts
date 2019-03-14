import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { getChoiceFromValue, SEVERITIES, STATUS } from '../bugs-utils';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication.service';
import { FormControl } from '@angular/forms';
import { ProgramService } from '../../services/program.service';
import { debounceTime } from 'rxjs/operators';

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

    filters = {
        search: '',
        program: undefined,
        area: undefined,
        reproducible: undefined,
        severity: undefined,
        status: undefined,
        version: undefined
    };

    public filtersTrueFalse = [{
        value: true, name: 'Oui'
    }, {
        value: false, name: 'Non'
    }];

    programs = [];
    area = [];

    public statusFilters = STATUS;
    public severitiesFilters = SEVERITIES;

    bugs = null;

    getName = getChoiceFromValue;

    triggerFilters = new FormControl();
    searchControl = new FormControl();

    constructor(private router: Router, private bugService: BugService, public dialog: MatDialog, private toastr: ToastrService,
                private as: AuthenticationService, private programService: ProgramService) {
    }

    ngOnInit() {
        this.loadBugs();
        this.programService.listPrograms({page_size: 100, page:1}).subscribe(res => {
            this.programs = res.results;
        });

        this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(val => {
            this.loadBugs();
        });
    }

    navigateToUrl(url) {
        this.router.navigate(['/dashboard/bugs/' + url]);
    }

    loadBugs() {
        let params = {...this.params_page};

        if (this.filters.search) {
            params['search'] = this.filters.search;
        }

        if (this.filters.reproducible) {
            params['reproducible'] = this.filters.reproducible;
        }

        if (this.filters.status) {
            params['status'] = this.filters.status;
        }

        if (this.filters.severity) {
            params['severity'] = this.filters.severity;
        }

        if (this.filters.program) {
            params['program__id'] = this.filters.program.id;
        }

        if (this.filters.version) {
            params['bug_version__id'] = this.filters.version.id;
        }

        this.bugService.listBugs(params).subscribe(res => {
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
        if (this.bugs == null) {
            return true;
        }

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
