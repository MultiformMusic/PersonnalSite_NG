import { Component, OnInit, HostListener } from '@angular/core';
import { RssService } from '../../services/rss.service';

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

  toggleFilters: boolean = false;


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
    if (this.toggle) {
      this.toggle = false;
    }
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

  clickToggleFilters() {
    this.toggleFilters = !this.toggleFilters;
    if (!this.toggleFilters && this.toggle) {
      this.clikToggleButton();
    }
  }
}
