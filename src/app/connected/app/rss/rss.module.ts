import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { RssService } from './navigation/rss.service';

@NgModule({
    
  declarations: [],
  imports: [MaterialModule, HttpClientModule],
  providers: [RssService]
})
export class RssModule {}