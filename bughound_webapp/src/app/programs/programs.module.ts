import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfirmDeleteProgram, ProgramsListComponent } from './programs-list/programs-list.component';
import { ProgramsAddComponent } from './programs-add/programs-add.component';
import { ProgramsRoutingModule } from './programs-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyMaterialModule } from '../material/my-material.module';
import { ProgramsEditComponent } from './programs-edit/programs-edit.component';

@NgModule({
  declarations: [ProgramsListComponent, ProgramsAddComponent, DialogConfirmDeleteProgram, ProgramsEditComponent],
  imports: [
      CommonModule,
      ProgramsRoutingModule,
      FormsModule,
      NgbModule,
      FontAwesomeModule,
      MyMaterialModule
  ],
    entryComponents: [DialogConfirmDeleteProgram],
})
export class ProgramsModule { }
