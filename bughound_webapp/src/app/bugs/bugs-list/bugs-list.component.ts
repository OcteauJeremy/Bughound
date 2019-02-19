import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bugs-list',
  templateUrl: './bugs-list.component.html',
  styleUrls: ['./bugs-list.component.scss']
})
export class BugsListComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {}

    navigateToUrl(url) {
        this.router.navigate(['/dashboard/bugs/' + url]);
    }
}
