import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' },
    { path: '/dashboard/bugs', title: 'Bugs',  icon:'pe-7s-config', class: '' },
    { path: '/dashboard/users', title: 'Users',  icon:'pe-7s-user', class: '' },
    { path: '/dashboard/programs', title: 'Programs',  icon:'pe-7s-box2', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private as: AuthenticationService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => {
        if (!this.as.isAdmin() && menuItem.title == 'Users') {
            return false;
        }
        return true;
    });
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
