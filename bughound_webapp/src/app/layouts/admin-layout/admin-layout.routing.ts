import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { DevelopperGuard } from '../../guards/developper-guard.service';
import { AdminGuard } from '../../guards/admin-guard.service';
import { AdminDevelopperGuard } from '../../guards/admin_developper-guard.service';

export const AdminLayoutRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'bugs',
        loadChildren: '../../bugs/bugs.module#BugsModule'
    },
    {
        canActivate: [AdminGuard],
        path: 'users',
        loadChildren: '../../users/users.module#UsersModule'
    },
    {
        canActivate: [AdminDevelopperGuard],
        path: 'programs',
        loadChildren: '../../programs/programs.module#ProgramsModule'
    }
];
