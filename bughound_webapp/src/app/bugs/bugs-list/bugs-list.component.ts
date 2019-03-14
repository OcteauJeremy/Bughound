import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { getChoiceFromValue } from '../bugs-utils';

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

    constructor(private router: Router, private bugService: BugService) { }

    ngOnInit() {
        this.loadBugs()
    }

    navigateToUrl(url) {
        this.router.navigate(['/dashboard/bugs/' + url]);
    }

    loadBugs() {
        this.bugService.listBugs(this.params_page).subscribe(res => {
            this.bugs = res;
        });
    }
}
