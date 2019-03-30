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
  stylesFab = {
    opacity: 0,
  }

  screenHeight:any;
  screenWidth:any;
  rotate: boolean = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        this.showButtonRssTop()
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
        this.showButtonRssTop();
      }
    );

    this.beginLoadingSubscription = this.rssService.beginLoading.subscribe(
      (begin) => {
        this.loading = begin;
        this.showButtonRssTop()
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

  showButtonRssTop() {
    if (this.feeds.length > 0 && this.screenWidth < 768) {
      this.stylesFab.opacity = 0.8;
    } else {
      this.stylesFab.opacity = 0;
    }
  }

}
