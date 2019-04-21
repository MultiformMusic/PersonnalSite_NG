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
import { RssListComponent } from './app/rss/rss-list/rss-list.component';
import { RssFiltersComponent } from './app/rss/navigation/rss-filters/rss-filters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RssManageComponent } from './app/rss/rss-manage/rss-manage.component';

import { StoreModule } from '@ngrx/store';
import { reducers } from './connected.reducer';
import { RssUrlsComponent } from './app/rss/rss-manage/rss-urls/rss-urls.component';
import { RssCategoriesComponent } from './app/rss/rss-manage/rss-categories/rss-categories.component';
import { RssModalAddComponent } from './app/rss/rss-manage/rss-modal-add/rss-modal-add.component';
import { ModalConfirmDeleteComponent } from './app/rss/rss-manage/modal-confirm-delete/modal-confirm-delete.component';
import { SafePipe } from '../pipe/safe.pipe';


const routes: Routes = [
    { path: 'connected', 
     component: ConnectedComponent, canActivate: [AuthenticationGuard], 
     children: [
         { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard], },
         { path: 'rss', component: RssComponent, canActivate: [AuthenticationGuard], 
         children: [
            {path: '', component: RssListComponent, canActivate: [AuthenticationGuard]},
            {path: 'list', component: RssListComponent, canActivate: [AuthenticationGuard]},
            {path: 'manage', component: RssManageComponent, canActivate: [AuthenticationGuard]},
         ] },
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
        RssListComponent,
        RssHeaderComponent,
        RssFiltersComponent,
        RssManageComponent,
        RssUrlsComponent, 
        RssCategoriesComponent,
        RssModalAddComponent,
        ModalConfirmDeleteComponent,
        SafePipe
    ],
    imports: [
        CommonModule,
        RssModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(reducers),
        RouterModule.forChild(routes)
    ],
    providers: [AuthenticationGuard]
})
export class ConnectedModule {

}