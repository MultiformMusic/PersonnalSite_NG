import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { constants } from 'src/helpers/constants';
import { Subscription } from 'rxjs';
import { RssUrl } from '../../models/rss-url';

@Component({
  selector: 'app-rss-filters',
  templateUrl: './rss-filters.component.html',
  styleUrls: ['./rss-filters.component.css']
})
export class RssFiltersComponent implements OnInit, OnDestroy {

  // permet de savoir si le filtrage est visible
  @Input() toggleFilters: boolean = false;

  // objet contenant les filtres à appliquer
  filters = {
    category: constants.CATEGORY_ALL,
    rssName: constants.RSS_NAME_ALL,
  }

  // permet de savoir si on reload (par refresh) pour raz les filtres
  rssUrlsSubscription: Subscription;

  constructor(public rssService: RssService) { }

  ngOnInit() {

    this.rssUrlsSubscription = this.rssService.rssUrlsLoading.subscribe(

      (rssUrlsFromDb: RssUrl[]) => {
        this.filters.category = constants.CATEGORY_ALL;
        this.filters.rssName = constants.RSS_NAME_ALL;
      }
    );
  }

  /**
   * change select sur filtre Category
   * 
   * @param category 
   * 
   */
  applyFilterCategory(category: string) {
    this.filters.category = category;
    this.rssService.applyFilters(this.filters);
  }

  /**
   * 
   * change select sur filtre RssName
   * 
   * @param rssName 
   * 
   */
  applyFilterRssName(rssName: string) {
    this.filters.rssName = rssName;
    this.rssService.applyFilters(this.filters);
  }
  

  ngOnDestroy() {
    this.rssUrlsSubscription.unsubscribe();
  }
}
