import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginLayoutRoutes } from './login-layout.routing';
import { LoginHomeComponent } from '../../login-home/login-home.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@NgModule({
    declarations: [LoginHomeComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(LoginLayoutRoutes)
    ],
    providers: [
    ]
})
export class LoginLayoutModule { }
