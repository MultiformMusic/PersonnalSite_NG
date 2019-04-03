import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { constants } from 'src/helpers/constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-rss-filters',
  templateUrl: './rss-filters.component.html',
  styleUrls: ['./rss-filters.component.css']
})
export class RssFiltersComponent implements OnInit, OnChanges {

  // permet de savoir si le filtrage est visible
  @Input() toggleFilters: boolean = false;

  // obket contenant les filtres à appliquer
  filters = {
    category: constants.CATEGORY_ALL,
    rssName: constants.RSS_NAME_ALL,
  }

  constructor(public rssService: RssService) { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  applyFilterCategory(category: string) {
    this.filters.category = category;
    this.rssService.applyFilters(this.filters);
  }

  applyFilterRssName(rssName: string) {
    this.filters.rssName = rssName;
    this.rssService.applyFilters(this.filters);
  }
  
}
