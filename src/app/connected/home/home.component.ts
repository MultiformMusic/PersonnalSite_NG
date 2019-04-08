import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from '../connected.reducer';
import * as Rss from '../app/rss/ngrx/rss.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {

    this.store.dispatch(new Rss.setLoading(true));
  }

}
