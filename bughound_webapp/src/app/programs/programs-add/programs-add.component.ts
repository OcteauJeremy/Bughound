import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { ProgramService } from '../../services/program.service';

@Component({
  selector: 'app-programs-add',
  templateUrl: './programs-add.component.html',
  styleUrls: ['./programs-add.component.scss']
})
export class ProgramsAddComponent implements OnInit {

    program = {
        name: '',
        versions: [
            {name: ''}
        ]
    };

    constructor(private programService: ProgramService, private toastr: ToastrService, private router: Router) { }

    ngOnInit() {
    }

    createProgram() {
        let program_obj = {...this.program}

        program_obj.versions = program_obj.versions.filter(v => v.name != '');
        this.programService.createProgram(program_obj).subscribe(res => {
            this.toastr.success('Program created.');
            this.router.navigate(['dashboard', 'programs'])
        })
    }

    cancelProgram() {
        this.toastr.success('Program cancel.');
        this.router.navigate(['/dashboard/programs'])
    }

    deleteVersion(idx) {
        this.program.versions.splice(idx, 1);
    }

    checkNumberInput() {
        let addInput = true;
        for (let version of this.program.versions) {
            if (version.name == '') {
                addInput = false;
            }
        }

        if (addInput) {
            this.program.versions.push({name: ''});
        }

    }

}
