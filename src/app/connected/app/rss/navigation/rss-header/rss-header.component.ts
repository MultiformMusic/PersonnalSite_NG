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
  collapseValue: string = 'collapse';
  ariaExpand: boolean = false;

  constructor(private rssService: RssService) { }

  ngOnInit() {
  }

  refresh() {
    this.clikToggleButton();
    this.rssService.getFeedFromUrls(constants.arrayOfRssUrl);
  }

  clikToggleButton() {
    this.toggle = !this.toggle;
    this.collapseValue = this.toggle ? 'collpase' : 'collpase';
    this.ariaExpand = this.toggle ? true : false;  
  }
}
