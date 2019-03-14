import { NgModule } from '@angular/core';
import { MatDialogModule, MatInputModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    declarations: [],
    exports: [
        NgxMatSelectSearchModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule
    ]
})
export class MyMaterialModule { }
