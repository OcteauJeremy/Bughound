import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../../services/program.service';
import { BugService } from '../../services/bug.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { REPORT_TYPES, SEVERITIES } from '../bugs-utils';

@Component({
  selector: 'app-bugs-add',
  templateUrl: './bugs-add.component.html',
  styleUrls: ['./bugs-add.component.scss']
})
export class BugsAddComponent implements OnInit {

    selectedProgram = null;
    selectedVersion = null;
    programs = [];

    report_types = REPORT_TYPES;
    severities = SEVERITIES;


    bug = {
        program: null,
        bug_version: null,
        report_type: 0,
        severity: 0,
        summary: '',
        reproducible: false,
        description: '',
        suggested_fix: '',
        reported_date: null,
    };

    constructor(private programService: ProgramService, private bugService: BugService, private toastr: ToastrService,
                private router: Router) { }

    ngOnInit() {
        this.programService.listPrograms({page_size: 100, page: 1}).subscribe(res => {
            this.programs = res.results;
            this.selectedProgram = this.programs[0];
            if (this.selectedProgram.versions.length > 0) {
                this.selectedVersion = this.selectedProgram.versions[0];
            }
        })
    }

    programChanged(program) {
        if (program.versions.length > 0) {
            this.selectedVersion = program.versions[0];
        } else {
            this.selectedVersion = null;
        }
    }

    createBug() {
        let bug_obj = {...this.bug};
        bug_obj.program = this.selectedProgram;
        bug_obj.bug_version = this.selectedVersion;
        bug_obj.reported_date = moment().format('YYYY-MM-DD');

        if (bug_obj.summary.trim() == '') {
            this.toastr.error('Summary Needed.')
        }
        if (bug_obj.description.trim() == '') {
            this.toastr.error('Description Needed.')
        }

        
        this.bugService.createBug(bug_obj).subscribe(res => {
            this.toastr.success('Bug created.')
            this.router.navigate(['/dashboard/bugs']);
        });
    }

    resetBug() {
        let bug_obj = {...this.bug};
        this.bug.program = null;
        this.bug.bug_version = null;
        this.bug.report_type = 0;
        this.bug.severity = 0;
        this.bug.summary = '';
        this.bug.reproducible = false;
        this.bug.description = '';
        this.bug.suggested_fix = '';
        this.bug.reported_date = null;
        this.toastr.success('Bug reset.')
    }

    cancelBug() {
        this.toastr.success('Operation cancel')
        this.router.navigate(['dashboard/bugs']);
    }
}
