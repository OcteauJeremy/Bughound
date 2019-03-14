import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BugsListComponent} from './bugs-list/bugs-list.component';
import { BugsAddComponent } from './bugs-add/bugs-add.component';
import { BugsEditComponent } from './bugs-edit/bugs-edit.component';

const routes: Routes = [
    { path: '', component: BugsListComponent },
    { path: 'add', component: BugsAddComponent },
    { path: 'edit/:id', component: BugsEditComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BugsRoutingModule { }
