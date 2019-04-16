import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RssService } from '../../services/rss.service';
import { Subscription } from 'rxjs';
import { RssUrl } from '../../models/rss-url';
import { constants } from 'src/helpers/constants';

@Component({
  selector: 'rss-modal-add',
  templateUrl: './rss-modal-add.component.html',
  styleUrls: ['./rss-modal-add.component.css']
})
export class RssModalAddComponent implements OnInit, OnDestroy {

  @ViewChild('modalRssAdd') modalRssAdd: any;
  @ViewChild('modalContainer') modalContainer: any;

  // subscription au résultat recherche url rss
  resultSearchRssUrls: Subscription;
  rssUrlsFromSearch: RssUrl[] = [];
  selectedRssUrlName: string = constants.RSS_SEARCH_LIST;
  keywords: string = '';

  modalAddRssForm: FormGroup;

  constructor(private rssService: RssService) { }

  ngOnInit() {

    this.rssUrlsFromSearch.push({
      id: '',
      name: constants.RSS_SEARCH_LIST,
      url: '',
      category: '',
      email: '',
      active: true,
      icon: '',
    });

  }

    /** Gestion MODAL */
    openModal() {

      // subscription aux résultats recherche url rss
      this.resultSearchRssUrls = this.rssService.rssUrlsResultSearch.subscribe(
        (rssUrlsFromSearch: RssUrl[]) => {

          rssUrlsFromSearch.unshift({
            id: '',
            name: constants.RSS_SELECT_LIST,
            url: '',
            category: '',
            email: '',
            active: true,
            icon: '',
          })

          this.rssUrlsFromSearch = rssUrlsFromSearch;
        }
      );

      this.doSearchRssUrls();

      this.modalRssAdd.nativeElement.style.display = 'block';

      setTimeout( () => {
        this.modalRssAdd.nativeElement.className = 'modal fade show modal-transition-in';
      }, 100)
    }
  
    closeModal() {

      this.resultSearchRssUrls.unsubscribe();

      this.selectedRssUrlName = constants.RSS_SEARCH_LIST;
      this.rssUrlsFromSearch.push({
        id: '',
        name: constants.RSS_SEARCH_LIST,
        url: '',
        category: '',
        email: '',
        active: true,
        icon: '',
      });
      
      this.modalRssAdd.nativeElement.className = 'modal fade modal-transition-in';
      setTimeout( () => {
        this.modalRssAdd.nativeElement.style.display = 'none';
      }, 200)
      
    }

    addRss() {

    }
    
    doSearchRssUrls() {
      this.rssService.searchRssUrls('science');
    }

    selectedRssName(rssName: string) {
      this.selectedRssUrlName = rssName;
      console.log("selectedRssUrlName = ", this.selectedRssUrlName);
    }

    ngOnDestroy() {
      if (this.resultSearchRssUrls) {
        this.resultSearchRssUrls.unsubscribe();
      }
    }

}
