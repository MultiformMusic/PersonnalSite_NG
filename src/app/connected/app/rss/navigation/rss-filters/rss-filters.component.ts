import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { constants } from 'src/helpers/constants';
import { Subscription } from 'rxjs';
import { RssUrl } from '../../models/rss-url';

@Component({
  selector: 'app-rss-filters',
  templateUrl: './rss-filters.component.html',
  styleUrls: ['./rss-filters.component.css']
})
export class RssFiltersComponent implements OnInit, OnDestroy, OnChanges {

  // permet de savoir si le filtrage est visible
  @Input() toggleFilters: boolean = false;
  toggleFiltersDelayed: boolean = false;

  // objet contenant les filtres à appliquer
  filters = {
    category: constants.CATEGORY_ALL,
    rssName: constants.RSS_NAME_ALL,
  }

  // permet de savoir si on reload (par refresh) pour raz les filtres
  rssUrlsSubscription: Subscription;

  // permet de savoir si filtre actif
  @Output() activeFilters = new EventEmitter<any>();

  constructor(public rssService: RssService) { }

  ngOnInit() {

    this.rssUrlsSubscription = this.rssService.rssUrlsLoading.subscribe(

      (rssUrlsFromDb: RssUrl[]) => {
        this.filters.category = constants.CATEGORY_ALL;
        this.filters.rssName = constants.RSS_NAME_ALL;
      }
    );
  }

  ngOnChanges() {

    setTimeout(() => {
      this.toggleFiltersDelayed = this.toggleFilters
    }, 5);
  }

  /**
   * change select sur filtre Category
   * 
   * @param category 
   * 
   */
  applyFilterCategory(category: string) {

    this.filters.category = category;
    this.checkEmitEvent();
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
    this.checkEmitEvent();
    this.rssService.applyFilters(this.filters);
  }
  
  /**
   * 
   * Détermine si un filtre est actif et emet un événement vers
   * le Header Component pour afficher modif lien suivant si un filtre
   * est actif
   * 
   */
  private checkEmitEvent() {

    let categoryFilter = undefined;
    let rssNameFilter = undefined;
    let isFiltersActive = false;

    if (this.filters.category !== constants.CATEGORY_ALL) {
      isFiltersActive = true;
      categoryFilter = this.filters.category;
    }

    if (this.filters.rssName !== constants.RSS_NAME_ALL) {
      isFiltersActive = true;
      rssNameFilter = this.filters.rssName;
    }

    this.activeFilters.emit({
      isFiltersActive,
      rssNameFilter,
      categoryFilter
    });

    /*if (this.filters.category !== constants.CATEGORY_ALL || 
        this.filters.rssName !== constants.RSS_NAME_ALL) {

          this.activeFilters.emit(true);

    } else {

        this.activeFilters.emit(false);
    }*/

  }

  ngOnDestroy() {
    if (this.rssUrlsSubscription) {
      this.rssUrlsSubscription.unsubscribe();
    }
  }
}
