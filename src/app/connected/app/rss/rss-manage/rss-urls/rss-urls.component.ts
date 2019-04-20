import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
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

    this.rssUrls$ = this.rssService.loadsRssUrlsForManage();

  }

  updateName(rssUrl: RssUrl) {
    const rssUrlModif = {...rssUrl, name: rssUrl.name};
    this.rssService.updateRssUrl(rssUrlModif);
  }

  deleteRssUrl(rssUrl: RssUrl) {
    console.log('delete = ', rssUrl);
    this.rssService.deleteRssUrl(rssUrl)
        .then(() => this.toastr.info('RSS deleted'))
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
    this.rssService.updateRssUrl(rssUrlModif);

    this.store.dispatch(new actions.setFromCache(false));
  }

  /**
   * 
   * Appui sur bouton retour => animation puis retour rss feeds list
   * 
   */
  backRssList() {
  
    this.store.dispatch(new actions.setFromCache(true));

    this.rssUrlsList.nativeElement.className = 'bounceOut';

    setTimeout(() => {

      this.router.navigate(['/connected/rss/list']);
    
    }, 600);

  }

}
