import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { RssService } from './navigation/services/rss.service';
import { CommonModule } from '@angular/common';


@NgModule({
    
  declarations: [],

  imports: [MaterialModule,
            CommonModule,
            HttpClientModule     
          ],

  providers: [RssService]
})
export class RssModule {}