import { Component, OnInit, HostListener } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { constants } from '../../../../../../helpers/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rss-header',
  templateUrl: './rss-header.component.html',
  styleUrls: ['./rss-header.component.css']
})
export class RssHeaderComponent implements OnInit {

  // pour gérer tooble bouton de nav
  toggle: boolean = false;
  collapseValue: string = 'collapse';
  ariaExpand: boolean = false;


  constructor(private rssService: RssService) { }

  ngOnInit() {
  }

  /**
   * 
   * Click bouton Refresh
   * 
   */
  refresh() {
    this.rssService.refreshRssFeeds();
    this.clikToggleButton();
  }

  /**
   * 
   * Click bouton Toggle nav
   * 
   */
  clikToggleButton() {
    this.toggle = !this.toggle;
    this.collapseValue = this.toggle ? 'collpase' : 'collpase';
    this.ariaExpand = this.toggle ? true : false;  
  }
}
