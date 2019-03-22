import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProgramService } from '../../services/program.service';
import { DialogConfirmDeleteUser } from '../../users/users-list/users-list.component';
import { AuthenticationService } from '../../services/authentication.service';
import { debounceTime } from 'rxjs-compat/operator/debounceTime';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['./programs-list.component.scss']
})
export class ProgramsListComponent implements OnInit {

    params_page = {
        page_size: 10,
        page: 1
    };
    programs = null;

    constructor(private router: Router, private programService: ProgramService, public dialog: MatDialog,
                private toastr: ToastrService, private as: AuthenticationService) {}

    ngOnInit() {
        this.loadPrograms();
    }

    navigateToUrl(url) {
        this.router.navigate(['/dashboard/programs/' + url]);
    }

    getProgramVersion(program) {
        return program.versions.map(e => e.name).join(', ');
    }

    getProgramArea(program) {
        return program.areas.map(e => e.name).join(', ');
    }

    loadPrograms() {
        this.programService.listPrograms(this.params_page).subscribe(res => {
            this.programs = res;
        })
    }

    canEdit() {
        return this.as.isDevelopper() || this.as.isAdmin();
    }

    canDelete() {
        return this.as.isAdmin();
    }

    openDialogDeleteProgram(prog): void {
        const dialogRef = this.dialog.open(DialogConfirmDeleteProgram, {
            width: '550px',
            data: {prog: prog}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.programService.deleteProgram(prog).subscribe(res => {
                    this.params_page = {
                        page_size: 10,
                        page: 1
                    };
                    this.loadPrograms();
                    this.toastr.success('Program ' + result.name + ' deleted.');
                });
            }
        });
    }

    exportResults(type) {
        this.programService.exportPrograms({type: type}).subscribe(res => {
            const csvList = res.result.split('#');
            const headers = csvList.shift().split(',');

            const options = {
                headers: headers,
            };

            let finalData = [];
            for (let row of csvList) {
                let dataSplitted = {};
                const rowSplitted = row.split(',');

                rowSplitted.forEach((val, idx) => {
                    dataSplitted[headers[idx]] = val;
                });
                finalData.push(dataSplitted);
            }
            new Angular5Csv(finalData, 'programs-export', options);
        });
    }

}

@Component({
    selector: 'app-dialog-confirm-delete-program',
    templateUrl: 'dialog-confirm-delete-program.html',
})
export class DialogConfirmDeleteProgram {

    constructor(
        public dialogRef: MatDialogRef<DialogConfirmDeleteProgram>,
        @Inject(MAT_DIALOG_DATA) public data) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

}