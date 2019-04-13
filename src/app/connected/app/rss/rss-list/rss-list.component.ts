import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { RssService } from '../services/rss.service';
import { RssUrl } from './../models/rss-url';
import * as Rss from '../ngrx/rss.actions';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../connected.reducer';

@Component({
  selector: 'app-rss-list',
  templateUrl: './rss-list.component.html',
  styleUrls: ['./rss-list.component.css']
})
export class RssListComponent implements OnInit {

  // utilisé par Home pour savoir le nombre de feeds  à afficher
  @Input() showNbrFeeds: number;

  /**  Subscription sur RssService 
   *   chargement en cours 
   *   Feeds chargées
  */
  rssUrlsSubscription: Subscription;
  feedSubscription: Subscription;

  // stockage de toutes les feeds
  allFeeds: any[] = [];
  // feeds affichées (éventuellement filtrées)
  feeds: any[] = [];

  // liste des url rss (active et inactive)
  rssUrls: any[] = [];
  rssUrls$: Observable<RssUrl[]>;
  fromCache: boolean = false;

  // gère affichage "Loading ...."
  isLoading$: Observable<boolean>;
  
  // gère visibilité bouton "Up" (opacity 0 => pas visible)
  stylesFab = {
    opacity: 0,
  }

  // rotation carte feed RSS
  rotate: boolean = false;

  // dimension écran
  screenHeight:any;
  screenWidth:any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
          this.showButtonRssTop()
  }

  constructor(private rssService: RssService,
              private store: Store<fromRoot.State>) { 

    this.getScreenSize();
  }

  ngOnInit() {

    console.log('Rss list ngOnInit')
    
    // NGRX : abonnement au store
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.rssUrls$ = this.store.select(fromRoot.getRssUrls);
    this.store.select(fromRoot.getFromCache).subscribe(
      (fromCache: boolean) => this.fromCache = fromCache
    );

    // dispatch action : filtres de nouveau visibles
    this.store.dispatch(new Rss.showFilters(true));

    this.rssUrlsSubscription = this.rssService.rssUrlsLoading.subscribe(
      (rssUrlsFromDb: RssUrl[]) => {

        this.rssUrls = rssUrlsFromDb;
        
        // début chargement des feeds : 
        // on prend du cache car feeds déjà chargées pas Home
        // on ne prend que les urls actives
        //words.filter(word => word.length > 6)

        const rssActive= this.rssUrls.filter(rssUrl => rssUrl.active === true);

        this.rssService.getFeedFromUrls(rssActive, this.fromCache);
      }
    )


    /** Subscription chargement feeds de RssService */
    this.feedSubscription = this.rssService.feedLoading.subscribe(
      (feeds) => {
        this.allFeeds = [...feeds];
        if (this.showNbrFeeds && this.showNbrFeeds > 0) {
          this.feeds = this.allFeeds.slice(0, this.showNbrFeeds)
        } else {
          this.feeds = this.allFeeds;
        }

        this.showButtonRssTop();
      }
    );

    this.rssService.loadUrlRssFromDatabase();
    document.getElementById("idSidemenuRssLink").click();
    
  }

  /**
   * Gestion du click sur une card RSS Feed pour rotation suivant largeur écrans
   */
  showBackContent(index: number) {

    this.markFeedAsReaded(index);

    if (this.screenWidth < 700) {
      this.rotate = true;
    } else {
      this.rotate = !this.rotate;
    }
  }

  /**
   * Marque le feed d'index comme lu
   * 
   * @param index 
   *
   */
  markFeedAsReaded(index: number) {

    for (let i = 0; i < this.feeds.length; i++) {      
      if (i === index)  {
        this.feeds[index].readed = true;
        break;
      }
    }
  }

  /**
   * 
   * Affichage bouton up suivant largeur écran et si feeds chargées
   */
  showButtonRssTop() {
    if (this.feeds.length > 0 && this.screenWidth < 768) {
      this.stylesFab.opacity = 0.8;
    } else {
      this.stylesFab.opacity = 0.8;
    }
  }

  scrollToView() {
    document.getElementById("sidemenu").scrollIntoView();
  }


  ngOnDestroy() {
    if (this.feedSubscription) {
      this.feedSubscription.unsubscribe();
    }
    if (this.rssUrlsSubscription) {
      this.rssUrlsSubscription.unsubscribe();
    }
  }


}
