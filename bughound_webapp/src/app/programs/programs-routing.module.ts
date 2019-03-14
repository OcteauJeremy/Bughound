import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ProgramsAddComponent } from './programs-add/programs-add.component';
import { ProgramsListComponent } from './programs-list/programs-list.component';
import { ProgramsEditComponent } from './programs-edit/programs-edit.component';

const routes: Routes = [
    { path: '', component: ProgramsListComponent },
    { path: 'add', component: ProgramsAddComponent },
    { path: 'edit/:id', component: ProgramsEditComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProgramsRoutingModule { }
