import { Component, OnInit } from '@angular/core';
import { RssService } from './navigation/rss.service';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.css']
})
export class RssComponent implements OnInit {

  constructor(private rssService: RssService) { }

  ngOnInit() {
    this.rssService.getRssDatas();
  }

}
