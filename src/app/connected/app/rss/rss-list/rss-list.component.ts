import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { RssService } from '../services/rss.service';
import { constants } from '../../../../../helpers/constants'

@Component({
  selector: 'app-rss-list',
  templateUrl: './rss-list.component.html',
  styleUrls: ['./rss-list.component.css']
})
export class RssListComponent implements OnInit {

  feedSubscription: Subscription;
  beginLoadingSubscription: Subscription;

  feeds: any[] = [];
  loading: boolean = false;

  screenHeight:any;
  screenWidth:any;
  rotate: boolean = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        console.log(this.screenHeight, this.screenWidth);
  }

  constructor(private rssService: RssService) { 
    this.getScreenSize();
  }

  ngOnInit() {

    this.feedSubscription = this.rssService.feedLoading.subscribe(
      (feeds) => {
        this.feeds = [...feeds];
        this.loading = false;
      }
    );

    this.beginLoadingSubscription = this.rssService.beginLoading.subscribe(
      (begin) => {
        this.loading = begin;
      }
    );

    this.loading = true;

    this.rssService.getFeedFromUrls(constants.arrayOfRssUrl);
    
  }

  ngOnDestroy() {
    this.feedSubscription.unsubscribe();
    this.beginLoadingSubscription.unsubscribe();
  }

  showBackContent() {
    if (this.screenWidth < 700) {
      this.rotate = true;
    } else {
      this.rotate = !this.rotate;
    }
  }

}
