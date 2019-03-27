import { Component, OnInit, Input } from '@angular/core';
import { RssService } from '../navigation/services/rss.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rss-list',
  templateUrl: './rss-list.component.html',
  styleUrls: ['./rss-list.component.css']
})
export class RssListComponent implements OnInit {

  feedSubscription: Subscription;
  feeds: any[] = [];
  arrayOfRssUrl: string[] = ['https://www.lemonde.fr/rss/une.xml'];

  constructor(private rssService: RssService) { }

  ngOnInit() {

    this.feedSubscription = this.rssService.feedLoading.subscribe(
      (feeds) => {
        this.feeds = [...this.feeds, ...feeds];
      }
    );

    this.rssService.getFeedFromUrl(this.arrayOfRssUrl);
  }

  ngOnDestroy() {
    this.feedSubscription.unsubscribe();
  }

}
