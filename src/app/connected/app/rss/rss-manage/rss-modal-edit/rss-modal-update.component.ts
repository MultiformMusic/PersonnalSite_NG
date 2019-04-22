import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { RssService } from '../../services/rss.service';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category';
import { constants } from 'src/helpers/constants';
import { RssUrl } from '../../models/rss-url';

@Component({
  selector: 'rss-modal-update',
  templateUrl: './rss-modal-update.component.html',
  styleUrls: ['./rss-modal-update.component.css']
})
export class RssModalUpdateComponent implements OnInit {

  @ViewChild('modalRssUpdate') modalRssUpdate: any;

  rssUrlToUpdate: RssUrl;
  updatingRss: boolean = false;
  nameUpdated: string = '';

  // subscription pour catégories
  categoriesSub: Subscription;
  categoriesList: Category[] = [];
  defaultCategory = constants.CATEGORY_SELECT_LIST;
  selectedCategory: string = this.defaultCategory;

  screenHeight: any;

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = (window.innerHeight / 2) - 220;
    }

  constructor(private rssService: RssService) { 
    this.getScreenSize();
  }

  ngOnInit() {
  }

      /**
     * 
     * Ouverture modal
     * 
     * - on initialise les subscriptions
     * 
     */
    openModal(rssUrl: RssUrl) {

      this.rssUrlToUpdate = rssUrl;
      this.selectedCategory = rssUrl.category;
      this.nameUpdated = rssUrl.name;

      // subscription aux catégories
      this.categoriesSub = this.rssService.categoriesLoading.subscribe(
        (categories: Category[]) => {
          this.categoriesList = categories;
          console.log("categories = ", this.categoriesList);
        }
      );

      // chargement des categories
      this.rssService.loadCategoriesFromDatabase();

      // affichage modal
      this.modalRssUpdate.nativeElement.style.display = 'block';
      setTimeout( () => {
        this.modalRssUpdate.nativeElement.className = 'modal fade show modal-transition-in';
      }, 100);

    }

        /**
     * 
     * Fermeture modal : on nettoie les varialbes
     * 
     */
    closeModal() {

      if (this.categoriesSub) {
        this.categoriesSub.unsubscribe();
      }
      this.updatingRss = false;

      this.modalRssUpdate.nativeElement.className = 'modal fade modal-transition-in';
      setTimeout( () => {
        this.modalRssUpdate.nativeElement.style.display = 'none';
      }, 200);

    }

    updateRss() {
      
    }

}
