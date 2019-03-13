import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConnectedComponent } from './connected.component';
import { AuthenticationGuard } from '../Authentication/authentication.guard';

const routes: Routes = [
    { path: 'connected', 
     component: ConnectedComponent, canActivate: [AuthenticationGuard], 
     children: [
         { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] },
     ]
    }
];


@NgModule({

    declarations: [   
        ConnectedComponent,
        HomeComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    providers: [AuthenticationGuard]
})
export class ConnectedModule {

}