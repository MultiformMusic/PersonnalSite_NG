import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RssComponent } from './rss.component';
import { AuthenticationGuard } from 'src/app/Authentication/authentication.guard';
import { RssService } from './services/rss.service';

const routes: Routes = [
  { path: '', 
   children: [
       { path: 'rss', component: RssComponent, canActivate: [AuthenticationGuard] },

   ]
  }
];

@NgModule({
    
  declarations: [],

  imports: [MaterialModule,
            CommonModule,
            HttpClientModule,
            RouterModule.forChild(routes)     
          ],

  providers: [RssService]
})
export class RssModule {}