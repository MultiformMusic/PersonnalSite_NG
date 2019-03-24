import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConnectedComponent } from './connected.component';
import { AuthenticationGuard } from '../Authentication/authentication.guard';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RssComponent } from './app/rss/rss.component';
import { MaterialModule } from '../material.module';
import { RssModule } from './app/rss/rss.module';
import { RssHeaderComponent } from './app/rss/navigation/rss-header/rss-header.component';

const routes: Routes = [
    { path: 'connected', 
     component: ConnectedComponent, canActivate: [AuthenticationGuard], 
     children: [
         { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] },
         { path: 'rss', component: RssComponent, canActivate: [AuthenticationGuard] },
         { path: 'rssDatas', component: RssComponent, canActivate: [AuthenticationGuard] },
         { path: '**', component: HomeComponent, canActivate: [AuthenticationGuard] },
     ]
    }
];


@NgModule({

    declarations: [   
        ConnectedComponent,
        HomeComponent,
        SideMenuComponent,
        RssComponent,
        RssHeaderComponent,
    ],
    imports: [
        CommonModule,
        RssModule,
        MaterialModule,
        RouterModule.forChild(routes)
    ],
    providers: [AuthenticationGuard]
})
export class ConnectedModule {

}