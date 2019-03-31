import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { RssService } from '../services/rss.service';
import { constants } from '../../../../../helpers/constants'

@Component({
  selector: 'app-rss-list',
  templateUrl: './rss-list.component.html',
  styleUrls: ['./rss-list.component.css']
})
export class RssListComponent implements OnInit {

  // utilisé par Hom pour savoir le nombre de feeds  à afficher
  @Input() showNbrFeeds: number;

  /**  Subscription sur RssService 
   *   chargement en cours 
   *   Feeds chargées
  */
  feedSubscription: Subscription;
  beginLoadingSubscription: Subscription;

  // stockage de toutes les feeds
  allFeeds: any[] = [];
  // feeds affichées (évntuellement filtrées)
  feeds: any[] = [];

  // gère affichage "Loading ...."
  loading: boolean = false;
  
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

  constructor(private rssService: RssService) { 
    this.getScreenSize();
  }

  ngOnInit() {

    /** Subscription top début chargement feeds de RssService (pour afficher Loading) */
    this.beginLoadingSubscription = this.rssService.beginLoading.subscribe(
      (begin) => {
        this.loading = begin;
        this.showButtonRssTop()
      }
    );

    /** Subscription chargement feeds de RssService */
    this.feedSubscription = this.rssService.feedLoading.subscribe(
      (feeds) => {
        this.allFeeds = [...feeds];
        if (this.showNbrFeeds && this.showNbrFeeds > 0) {
          this.feeds = this.allFeeds.slice(0, this.showNbrFeeds)
        } else {
          this.feeds = this.allFeeds;
        }
        this.loading = false;
        this.showButtonRssTop();
      }
    );

    // début chargement des feeds : on prend du cache car feeds déjà chargées pas Home
    this.loading = true;
    this.rssService.getFeedFromUrls(constants.arrayOfRssUrl, true);
    
  }

  ngOnDestroy() {
    this.feedSubscription.unsubscribe();
    this.beginLoadingSubscription.unsubscribe();
  }

  /**
   * Gestion du click sur une card RSS Feed pour rotation suivant largeur écrans
   */
  showBackContent() {
    
    if (this.screenWidth < 700) {
      this.rotate = true;
    } else {
      this.rotate = !this.rotate;
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
      this.stylesFab.opacity = 0;
    }
  }

}
