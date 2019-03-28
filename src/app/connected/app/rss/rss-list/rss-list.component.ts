import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private rssService: RssService) { }

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

}
