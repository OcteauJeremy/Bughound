import { Component, OnInit } from '@angular/core';
import { AREAS, PRIORITIES, REPORT_TYPES, RESOLUTIONS, SEVERITIES, STATUS } from '../bugs-utils';
import { BugService } from '../../services/bug.service';
import { ProgramService } from '../../services/program.service';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
    selector: 'app-bugs-edit',
    templateUrl: './bugs-edit.component.html',
    styleUrls: ['./bugs-edit.component.scss']
})
export class BugsEditComponent implements OnInit {

    selectedProgram = null;
    selectedVersion = null;
    selectedSolvedVersion = null;
    selectedFunctionalArea = null;
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


    bug: any = {
        program: null,
        bug_version: null,
        report_type: 0,
        severity: 0,
        summary: '',
        reproducible: false,
        description: '',
        suggested_fix: '',
        reported_date: null,
        reported_by: null,
        area: null,
        solved_date: new moment()
    };

    dev = {
        comments: ''
    };

    user = null;

    disableUserReport = false;
    disableDevReport = false;
    isDevelopper = true;

    constructor(private programService: ProgramService, private bugService: BugService, private toastr: ToastrService,
                private route: ActivatedRoute, private as: AuthenticationService, private router: Router) {
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.isDevelopper = this.as.isDevelopper() || this.as.isAdmin();
        this.user = this.as.getUser();
        console.log(this.user);
        this.bugService.getBug(id).subscribe(res => {
            this.bug = res;
            this.disableDevReport = this.disabledDevReport();
            this.syncBugCmp();
        });
    }

    disabledDevReport() {
        if (this.bug == null) {
            return true;
        }

        if (this.as.isAdmin()) {
            return false;
        }

        if (this.bug.assigned_to != null && this.user.id == this.bug.assigned_to.id) {
            return false;
        }

        return true;
    }

    syncBugCmp() {
        if (this.bug.reported_by.id == this.as.getUser().id) {
            this.disableUserReport = false
        } else {
            this.disableUserReport = !this.as.hasAuthority('admin');
        }
        this.selectedProgram = this.bug.program;
        this.selectedVersion = this.bug.bug_version;
        this.selectedArea = this.bug.area;
        this.selectedStatus = this.bug['status'];
        this.selectedFunctionalArea = this.bug['functional_area'];
        this.selectedPriorities = this.bug['priority'];
        this.selectedResolution = this.bug['resolution'];
        this.selectedSolvedVersion = this.bug['resolution_version']
    }

    formatDate(date) {
        this.bug.solved_date = moment(date).format('YYYY-MM-DD');
    }

    updateBug() {
        let objBug = {...this.bug};

        objBug.program = this.selectedProgram;
        objBug.bug_version = this.selectedVersion;
        objBug.area = this.selectedArea;
        objBug.status = this.selectedStatus;
        objBug['priority'] = this.selectedPriorities;
        objBug['resolution'] = this.selectedResolution;
        objBug['resolution_version'] = this.selectedSolvedVersion;
        objBug['functional_area'] = this.selectedFunctionalArea;

        console.log(objBug, this.selectedFunctionalArea);
        this.bugService.updateBug(objBug).subscribe(res => {
            this.bug = res;
            this.syncBugCmp();
            this.toastr.success('Bug updated.');
            this.router.navigate(['/dashboard/bugs'])
        });
    }

    compId = (val1, val2) => val1.id == val2.id;

}
