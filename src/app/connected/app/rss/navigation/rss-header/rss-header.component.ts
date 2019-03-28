import { Component, OnInit, HostListener } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { constants } from '../../../../../../helpers/constants';

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

  refresh() {
    this.toggleNavBar();
    this.rssService.getFeedFromUrls(constants.arrayOfRssUrl);
  }

  toggleNavBar() {
    this.toggle = !this.toggle;
  }
}
