import { Component, OnInit, ElementRef, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../connected.reducer';
import * as actions from '../ngrx/rss.actions';

@Component({
  selector: 'app-rss-manage',
  templateUrl: './rss-manage.component.html',
  styleUrls: ['./rss-manage.component.css']
})
export class RssManageComponent implements OnInit, OnChanges {

  rssActive: boolean = true;
  categoriesActive: boolean = false;

  constructor(private store: Store<fromRoot.State>,
              private el: ElementRef) { }

  ngOnInit() {

    let elementRss = document.getElementById("idSidemenuRssLink");
    elementRss.classList.add("current");
    let elementHome = document.getElementById("idSidemenuHome");
    elementHome.classList.remove("current");

    this.store.dispatch(new actions.showFilters(false));
  }

  ngOnChanges() {
    let linkHome = this.el.nativeElement.querySelector('#idSidemenuHome');
    debugger;
    if (linkHome) {
      linkHome.classList.remove('current');
    }
  }

  rssConfiguration() {
    this.rssActive = true;
    this.categoriesActive = false;
  }

  categoriesConfiguration() {
    this.rssActive = false;
    this.categoriesActive = true;
  }

}
