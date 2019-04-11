import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RssUrl } from '../../models/rss-url';
import { RssService } from '../../services/rss.service';

@Component({
  selector: 'app-rss-urls',
  templateUrl: './rss-urls.component.html',
  styleUrls: ['./rss-urls.component.css']
})
export class RssUrlsComponent implements OnInit {

  rssUrls$: Observable<RssUrl[]>;

  constructor(private rssService: RssService) { }

  ngOnInit() {

    this.rssUrls$ = this.rssService.loadsRssUrlsForManage();
  }

  updateName(rssUrl: RssUrl) {
    debugger;
    const rssUrlModif = {...rssUrl, name: rssUrl.name + ' modif'};
    this.rssService.updateRssUrl(rssUrlModif);
  }

}
