import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RssService } from '../../services/rss.service';
import { Subscription } from 'rxjs';
import { RssUrl } from '../../models/rss-url';
import { constants } from 'src/helpers/constants';
import { AuthenticationService } from 'src/app/Authentication/services/authentication.service';
import { User } from 'src/app/models/user.model';

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
  defaultRssName = constants.RSS_SELECT_LIST;
  keywords: string = '';
  loadingRss: boolean = false;
  user: User;

  modalAddRssForm: FormGroup;

  constructor(private rssService: RssService,
              private authService: AuthenticationService) { }

  ngOnInit() {

    this.user = this.authService.getUserFromToken();
    console.log(this.user);

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

          this.loadingRss = false;

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
        }, 
        (error) => {
          this.loadingRss = false;
          console.log(error);
        }
      );

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

      const rssUrl = this.rssUrlsFromSearch.find(rss => rss.name === this.selectedRssUrlName);
      if (rssUrl) {
        rssUrl.id = rssUrl.url;
        rssUrl.email = this.user.email;
        if (!rssUrl.category) {
          rssUrl.category = 'Misceallous';
        }
        console.log(rssUrl)

        this.rssService.addRssUrl(rssUrl)
                       .then(
                         rss => console.log(rss)
                       )
                       .catch(
                         err => console.log(err)                       
                       );
      }
    }

    doSearchRssUrls() {
      console.log('keywords = ', this.keywords);
      this.loadingRss = true;
      this.rssService.searchRssUrls(this.keywords);
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
