import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { Subscription } from 'rxjs';
import { RssUrl } from '../../models/rss-url';
import { constants } from 'src/helpers/constants';
import { AuthenticationService } from 'src/app/Authentication/services/authentication.service';
import { User } from 'src/app/models/user.model';
import { Category } from '../../models/category';

@Component({
  selector: 'rss-modal-add',
  templateUrl: './rss-modal-add.component.html',
  styleUrls: ['./rss-modal-add.component.css']
})
export class RssModalAddComponent implements OnInit, OnDestroy {

  @ViewChild('modalRssAdd') modalRssAdd: any;

  // subscription au résultat recherche url rss
  resultSearchRssUrls: Subscription;
  rssUrlsFromSearch: RssUrl[] = [];
  selectedRssUrlName: string = constants.RSS_SEARCH_LIST;
  defaultRssName = constants.RSS_SELECT_LIST;
  keywords: string = '';
  loadingRss: boolean = false;
  user: User;

  // subscription pour catégories
  categoriesSub: Subscription;
  categoriesList: Category[] = [];
  defaultCategory = constants.CATEGORY_SELECT_LIST;
  selectedCategory: string = this.defaultCategory;

  // affichage résultat add rss
  addingRss: boolean = false;
  rssValid: boolean = true;
  resultMessage: string = '';
  resultClass: string = '';

  constructor(private rssService: RssService,
              private authService: AuthenticationService) { }

  ngOnInit() {

    this.user = this.authService.getUserFromToken();

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

    /**
     * 
     * Ouverture modal
     * 
     * - on initialise les subscriptions
     * - on lance la première récupération des feeds
     * - on lance résupération catégories
     * 
     */
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

      // subscription aux catégories
      this.categoriesSub = this.rssService.categoriesLoading.subscribe(
        (categories: Category[]) => {

          categories.unshift({
            name: constants.CATEGORY_SELECT_LIST,
            email: this.user.email,
          });

          this.categoriesList = categories;
          console.log("categories = ", this.categoriesList);
        }
      );

      // chargement des categories
      this.rssService.loadCategoriesFromDatabase();

      // affichage modal
      this.modalRssAdd.nativeElement.style.display = 'block';
      setTimeout( () => {
        this.modalRssAdd.nativeElement.className = 'modal fade show modal-transition-in';
      }, 100);
    }
  
    /**
     * 
     * Fermeture modal : on nettoie les varialbes
     * 
     */
    closeModal() {

      this.unsubSceribeAll();
      this.resultMessage = '';
      this.addingRss = false;
      this.rssValid = true;

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
      }, 200);
      
    }

    /**
     * 
     * Ajout RSS URL de manière async pour avoir le retour boolean
     * de la par du backend
     * 
     */
    async addRss() {

      this.addingRss = true;

      const rssUrl = this.rssUrlsFromSearch.find(rss => rss.name === this.selectedRssUrlName);
      if (rssUrl) {

        rssUrl.id = rssUrl.name;
        rssUrl.email = this.user.email;
        rssUrl.category = this.selectedCategory;

        if (!rssUrl.icon) {
          rssUrl.icon = '';
        }

        this.rssValid = await this.rssService.isUrlFeedValid(rssUrl);
        
        if (!this.rssValid) {
          this.resultClass = 'result-add-nok';
          this.resultMessage = 'Invalid RSS, please try another one';
          this.addingRss = false;
          return;
        }

        this.rssService.addRssUrl(rssUrl, this.user.email)
                       .then(
                         rss => {
                           this.addingRss = false;
                           this.resultClass = 'result-add-ok';
                           this.resultMessage = 'RSS added';
                         }
                       )
                       .catch(
                         err => {
                           console.log(err);
                           this.resultClass = 'result-add-nok';
                           this.resultMessage = 'Error while adding RSS';
                           this.addingRss = false;
                         }                       
                       );
      }
    }

    /**
     * 
     * Lance la recherche des URL RSS avec mot-clés
     * 
     */
    doSearchRssUrls() {
      this.resultMessage = '';
      this.loadingRss = true;
      this.rssService.searchRssUrls(this.keywords);
    }

    /**
     * 
     * handler sur select RSS NAME
     * 
     */
    selectedRssName(rssName: string) {
      this.resultMessage = '';
      this.selectedRssUrlName = rssName;
    }

    /**
     * 
     * Handler sur le select Category
     * 
     */
    selectedCategoryName(category: string) {
      this.resultMessage = '';
      this.selectedCategory = category;
    }


    ngOnDestroy() {
      this.unsubSceribeAll();
    }

    private unsubSceribeAll() {
      if (this.resultSearchRssUrls) {
        this.resultSearchRssUrls.unsubscribe();
      }

      if (this.categoriesSub) {
        this.categoriesSub.unsubscribe();
      }
    }

}


const cyrb53 = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1>>>16, 2246822507) ^ Math.imul(h2 ^ h2>>>13, 3266489909);
  h2 = Math.imul(h2 ^ h2>>>16, 2246822507) ^ Math.imul(h1 ^ h1>>>13, 3266489909);
  return String(4294967296 * (2097151 & h2) + (h1>>>0)).toString();
};