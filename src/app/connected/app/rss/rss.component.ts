import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import { RssService } from './navigation/services/rss.service';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.css']
})
export class RssComponent implements OnInit, OnDestroy {
  
  feedSubscription: Subscription;
  feeds: any[] = [];
  arrayOfRssUrl: string[] = ['https://www.lemonde.fr/rss/une.xml'];

  constructor(private rssService: RssService) { }

  ngOnInit() {

    this.feedSubscription = this.rssService.feedLoading.subscribe(
      (feeds) => {
        this.feeds = [...this.feeds, feeds];
      }
    );

    this.rssService.getFeedFromUrl(this.arrayOfRssUrl);
  }

  ngOnDestroy() {
    this.feedSubscription.unsubscribe();
  }

}
