import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugsRoutingModule } from './bugs-routing.module';
import { BugsListComponent } from './bugs-list/bugs-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BugsAddComponent } from './bugs-add/bugs-add.component';

@NgModule({
  declarations: [BugsListComponent, BugsAddComponent],
  imports: [
      CommonModule,
      BugsRoutingModule
  ]
})
export class BugsModule { }
