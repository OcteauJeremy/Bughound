import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugsRoutingModule } from './bugs-routing.module';
import { BugsListComponent } from './bugs-list/bugs-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BugsAddComponent } from './bugs-add/bugs-add.component';
import { MyMaterialModule } from '../material/my-material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { BugsEditComponent } from './bugs-edit/bugs-edit.component';

@NgModule({
  declarations: [BugsListComponent, BugsAddComponent, BugsEditComponent],
  imports: [
      CommonModule,
      FormsModule,
      BugsRoutingModule,
      NgbModule,
      MyMaterialModule,
      FontAwesomeModule,
      NgSelectModule,
      NgbModule,
      MomentModule
  ]
})
export class BugsModule { }
