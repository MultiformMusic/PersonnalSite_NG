import { Component, OnInit, HostListener } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../connected.reducer';
import * as Rss from '../../ngrx/rss.actions';

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

  showFilters$: Observable<boolean>;

  constructor(private rssService: RssService,
              private router: Router,
              private store: Store<fromRoot.State>) { }

  ngOnInit() {

    this.showFilters$ = this.store.select(fromRoot.getShowFilters);
  }

  /**
   * 
   * Click bouton Refresh
   * 
   */
  refresh() {

    this.store.dispatch(new Rss.showFilters(true));
    this.store.dispatch(new Rss.setLoading(true));
    
    if (this.toggle) {
      this.toggle = false;
    }
    
    this.router.navigate(['/connected/rss/list']);
  
  }

    /**
   * 
   * Click bouton Refresh
   * 
   */
  manage() {

    
    if (this.toggle) {
      this.toggle = false;
    }
    
    this.router.navigate(['/connected/rss/manage']);
  
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
