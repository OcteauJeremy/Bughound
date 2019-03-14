import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { DialogConfirmDeleteUser, UsersListComponent } from './users-list/users-list.component';
import { UsersAddComponent } from './users-add/users-add.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyMaterialModule } from '../material/my-material.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [UsersListComponent, UsersAddComponent, UsersEditComponent, DialogConfirmDeleteUser],
    imports: [
        CommonModule,
        FormsModule,
        UsersRoutingModule,
        NgbModule,
        FontAwesomeModule,
        NgSelectModule,
        MyMaterialModule
    ],
    entryComponents: [DialogConfirmDeleteUser],
})
export class UsersModule { }
