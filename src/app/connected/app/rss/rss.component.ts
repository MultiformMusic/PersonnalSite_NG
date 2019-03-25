import { Component, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { RssService } from './navigation/services/rss.service';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.css']
})
export class RssComponent implements OnInit {
  
  feedSubscription: Subscription;

  constructor(private rssService: RssService) { }

  ngOnInit() {
    this.feedSubscription = this.rssService.feedLoading.subscribe(
      (feeds) => {
        debugger;
      }
    );
    this.rssService.getFeedFromUrl('https://www.lemonde.fr/rss/une.xml');
  }

}
