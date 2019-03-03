import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConnectedComponent } from './connected.component';

const routes: Routes = [
    { path: 'connected', 
     component: ConnectedComponent,
     children: [
         { path: 'home', component: HomeComponent },
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
    providers: []
})
export class ConnectedModule {

}