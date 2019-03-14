import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../../services/program.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-programs-edit',
  templateUrl: './programs-edit.component.html',
  styleUrls: ['./programs-edit.component.scss']
})
export class ProgramsEditComponent implements OnInit {

    program = null;

    constructor(private route: ActivatedRoute, private programService: ProgramService, private toastr: ToastrService, private as: AuthenticationService) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        this.programService.getProgram(id).subscribe(res => {
            this.program = res;
            this.program.versions.push({name: ''});
        });
    }

    canDelete() {
        return this.as.isDevelopper();
    }

    updateProgram() {
        let program_obj = {...this.program};

        program_obj.versions = program_obj.versions.filter(v => v.name != '');
        this.programService.updateProgram(program_obj).subscribe(res => {
            this.program = res;
            this.program.versions.push({name: ''});
            this.toastr.success('Program updated.')
        });
    }


    deleteVersion(idx) {
        this.program.versions.splice(idx, 1);
    }

    checkNumberInput() {
        let addInput = true;

        if (this.program == null) {
            return;
        }

        for (const version of this.program.versions) {
            if (version.name === '') {
                addInput = false;
            }
        }

        if (addInput) {
            this.program.versions.push({name: ''});
        }

    }

}
