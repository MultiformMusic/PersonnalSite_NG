import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RssService } from './services/rss.service';
import { ReactiveFormsModule } from '@angular/forms';

/*
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'src/app/Authentication/authentication.guard';
import { RssManageComponent } from './rss-manage/rss-manage.component';
import { RssListComponent } from './rss-list/rss-list.component';
*/

/*const routes: Routes = [
  { path: '', 
   children: [
       { path: 'list', component: RssListComponent, canActivate: [AuthenticationGuard] },
       { path: 'manage', component: RssManageComponent, canActivate: [AuthenticationGuard] },

   ]
  }
];*/

@NgModule({

  imports: [MaterialModule,
            CommonModule,
            HttpClientModule,
            //RouterModule.forChild(routes)     
          ],

  providers: [RssService],

  declarations: []
})
export class RssModule {}