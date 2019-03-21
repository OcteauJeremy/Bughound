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

    createParamsFilter(params) {
        let paramsFilter = {...params};

        if (this.filters.search) {
            paramsFilter['search'] = this.filters.search;
        }

        if (this.filters.reproducible != undefined) {
            paramsFilter['reproducible'] = this.filters.reproducible;
        }

        if (this.filters.status != undefined) {
            paramsFilter['status'] = this.filters.status;
        }

        if (this.filters.severity != undefined) {
            paramsFilter['severity'] = this.filters.severity;
        }

        if (this.filters.program != undefined) {
            paramsFilter['program__id'] = this.filters.program.id;
        }

        if (this.filters.version != undefined) {
            paramsFilter['bug_version__id'] = this.filters.version.id;
        }

        return paramsFilter;
    }

    loadBugs() {
        let params = {...this.params_page};

        params = this.createParamsFilter(params);

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

    downLoadFile(data: any, type: string) {
        var blob = new Blob([data], { type: type});
        var url = window.URL.createObjectURL(blob);
        var pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            alert( 'Please disable your Pop-up blocker and try again.');
        }
    }

    exportResults(type) {
        let params = this.createParamsFilter({});

        params['type'] = type;

        this.bugService.exportBugs(params).subscribe(res => {
            console.log(res);
            this.downLoadFile(res, 'text/csv')
        })
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
