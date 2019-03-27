import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RssService } from '../services/rss.service';

@Component({
  selector: 'app-rss-header',
  templateUrl: './rss-header.component.html',
  styleUrls: ['./rss-header.component.css']
})
export class RssHeaderComponent implements OnInit {

  toggle: boolean = false;

  constructor(private rssService: RssService) { }

  ngOnInit() {
  }
}
