import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RssUrl } from '../../models/rss-url';
import { RssService } from '../../services/rss.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../connected.reducer';
import * as actions from '../../ngrx/rss.actions';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rss-urls',
  templateUrl: './rss-urls.component.html',
  styleUrls: ['./rss-urls.component.css']
})
export class RssUrlsComponent implements OnInit {

  rssUrls$: Observable<RssUrl[]>;
  showInfos: boolean = true;
  useFeedsCache: boolean = true;
  
  rssUrlAddSubscription: Subscription;

  @ViewChild('rssUrlsList') rssUrlsList: any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {

        this.showInfos = window.innerWidth < 550 ? false : true;        
  }

  constructor(private rssService: RssService,
              private toastr: ToastrService,
              private store: Store<fromRoot.State>,
              private router: Router) { 
              
      this.getScreenSize();

  }

  ngOnInit() {

    this.useFeedsCache = true;
    this.rssUrls$ = this.rssService.loadsRssUrlsForManage();
  }

  /**
   * 
   * Mise à jour d'une URL RSS
   * 
   * @param rssUrl 
   * 
   */
  updateName(rssUrl: RssUrl) {

    const rssUrlModif = {...rssUrl, name: rssUrl.name};
    this.rssService.updateRssUrl(rssUrlModif, rssUrl.email);

    this.useFeedsCache = false;
  }

  /**
   * 
   * Suppression d'une URL RSS
   * 
   * @param rssUrl 
   * 
   */
  deleteRssUrl(rssUrl: RssUrl) {

    this.useFeedsCache  = false;

    this.rssService.deleteRssUrl(rssUrl, rssUrl.email)
        .then(() => {this.toastr.info('RSS deleted'); this.useFeedsCache = false;})
        .catch(() => this.toastr.error('Error to delete'));
  }

  /**
   * 
   *  change l'état actif/inactif de l'url rss
   * 
   * @param rssUrl 
   * 
   */
  toggleActivated(rssUrl: RssUrl) {

    const activeModif = !rssUrl.active;
    const rssUrlModif = {...rssUrl, active: activeModif};
    this.rssService.updateRssUrl(rssUrlModif, rssUrl.email);

    this.useFeedsCache = false;
  }

  /**
   * 
   * Appui sur bouton retour => animation puis retour rss feeds list
   * Si modification => on ne prend pas les feeds du cache
   * 
   */
  backRssList() {

    this.store.dispatch(new actions.setLoading(!this.useFeedsCache));
    this.store.dispatch(new actions.setFromCache(this.useFeedsCache));

    this.rssUrlsList.nativeElement.className = 'bounceOut';
    setTimeout(() => {
      this.router.navigate(['/connected/rss/list']); 
    }, 600);

  }

  /**
   * 
   * gère m'événement EventEmitter lorsqu'une rss url a été ajoutée via la modal
   * 
   * @param addOk 
   * 
   */
  addRssUrlOk(addOk: boolean) {
    if (addOk) {
      this.useFeedsCache = false;
    }
  }

}
