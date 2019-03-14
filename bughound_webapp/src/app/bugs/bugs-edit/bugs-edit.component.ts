import { Component, OnInit } from '@angular/core';
import { AREAS, PRIORITIES, REPORT_TYPES, RESOLUTIONS, SEVERITIES, STATUS } from '../bugs-utils';
import { BugService } from '../../services/bug.service';
import { ProgramService } from '../../services/program.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bugs-edit',
  templateUrl: './bugs-edit.component.html',
  styleUrls: ['./bugs-edit.component.scss']
})
export class BugsEditComponent implements OnInit {


    selectedProgram = null;
    selectedVersion = null;
    programs = [];

    selectedArea = null;
    areas = AREAS;

    selectedStatus = null;
    status = STATUS;

    selectedPriorities = null;
    priorities = PRIORITIES;

    selectedResolution = null;
    resolutions = RESOLUTIONS;

    report_types = REPORT_TYPES;
    severities = SEVERITIES;

    selectedDate: NgbDateStruct;


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
        reported_by: null
    };

    dev = {
        comments: ''
    };

    disableUserReport = false;
    isDevelopper = true;

    constructor(private programService: ProgramService, private bugService: BugService, private toastr: ToastrService,
                private route: ActivatedRoute, private as: AuthenticationService) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.isDevelopper = this.as.hasAuthority('Developer');

        this.programService.getProgram({page_size: 100, page: 1}).subscribe(res => {
            this.programs = res.results;
        });

        this.bugService.getBug(id).subscribe(res => {
            this.bug = res;
            if (this.bug.reported_by.id != this.as.getUser().id) {
                this.disableUserReport = true
            }
            this.disableUserReport = !this.as.hasAuthority('admin');

            this.selectedProgram = this.bug.program;
            this.selectedVersion = this.bug.bug_version;
            this.selectedArea = this.bug['functionnal_area'];
            this.selectedStatus = this.bug['status'];
            this.selectedPriorities = this.bug['priority'];
            this.selectedResolution = this.bug['resolution'];
        });
    }

}
