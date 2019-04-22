import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import  { constants } from '../../../../../helpers/constants';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { RssUrl } from './../models/rss-url';
import { AuthenticationService } from 'src/app/Authentication/services/authentication.service';
import { User } from 'src/app/models/user.model';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../connected.reducer';
import * as Rss from '../ngrx/rss.actions';
import { Category } from '../models/category';

@Injectable()
export class RssService {

    /**
     * Emission événements :
     * 
     * - début chargement : pour afficher "Loading"
     * - chargement des feeds
     * - retour recherche des url rss
     */
    rssUrlsLoading = new Subject<RssUrl[]>();
    feedLoading = new Subject<any>();
    rssUrlsResultSearch = new Subject<RssUrl[]>();

    // événement pour le chargement catégories
    categoriesLoading = new Subject<Category[]>();

    // événement pour rss valid
    rssValid = new Subject<boolean>();

    // feeds en cache
    cacheFeeds: any[] = [];

    /**
     * 
     * Nécessaire aux filtrages
     * 
     */
    private rssNames: string[] = [];
    private categories: string[] = [];

    private rssUrlsCollection: AngularFirestoreCollection<RssUrl>;

    constructor(private http: Http,
                private authService: AuthenticationService,
                private db: AngularFirestore,
                private store: Store<fromRoot.State>) {}



    loadCategoriesFromDatabase() {

        // recherche de l'utilisateur connecté
        const user: User = this.authService.getUserFromToken();
        /*this.db.collection('categories', ref => ref.where('email','==', user.email ))
               .valueChanges().subscribe(
                   (categories: Category[]) => {
                        this.categoriesLoading.next(categories.sort(this.compare));
                   }    
               );*/

        console.log('user email = ', user.email)
        this.db.collection(`users/${user.email}/categories`)
               .valueChanges().subscribe(
                    (categories: Category[]) => {
                        this.categoriesLoading.next(categories.sort(this.compare));
                    }    
                );
    }

    /**
     * 
     * Chargement des url rss depuis la base firestore
     * 
     */
    loadUrlRssFromDatabase() {

        console.log('loadUrlRssFromDatabase');

        // recherche de l'utilisateur connecté
        const user: User = this.authService.getUserFromToken();

        // ré-initialisation
        this.categories = [];
        this.rssNames = [];

        this.db.collection(`users/${user.email}/rss-url`).valueChanges().subscribe(
            
            (rssUrlsArray: RssUrl[]) => {

                let resultRssUrl = rssUrlsArray.map(rssUrl => {
                    
                    // si l'url est active on récup rssName et Category pour filtres
                    if (rssUrl.active) {

                        if (!this.rssNames.includes(rssUrl.name)) {
                            this.rssNames.push(rssUrl.name);
                        }
                        if (!this.categories.includes(rssUrl.category)) {
                            this.categories.push(rssUrl.category);
                        }
                    }

                    return {
                        ...rssUrl
                    }
                })

                this.categories.sort();
                this.rssNames.sort();
                if (!this.rssNames.includes(constants.RSS_NAME_ALL)) {
                    this.categories.unshift(constants.CATEGORY_ALL);
                    this.rssNames.unshift(constants.RSS_NAME_ALL);
                }

                this.rssUrlsLoading.next(resultRssUrl);
            }
        );
    }

    /**
     * 
     * Chargement des url RSS pour la partie Manage
     * 
     * Retourne un tableau d'observable pour chaque Url Rss
     * 
     */
    loadsRssUrlsForManage(): Observable<RssUrl[]> {

        // recherche de l'utilisateur connecté
        const user: User = this.authService.getUserFromToken();

        // handler sur la collection rss-url
        this.rssUrlsCollection = this.db.collection<RssUrl>(`users/${user.email}/rss-url`);

        // construction tableau Observable sur les rss url de la collection
        return this.rssUrlsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
              console.log(a);
              const data = a.payload.doc.data() as RssUrl;
              const id = a.payload.doc.id;
              return {id, ...data };
            }))
        );
    }

    /**
     * 
     * Mise à jour du RSS
     * 
     * @param rssUrl 
     * 
     */
    updateRssUrl(rssUrl: RssUrl, userEmail: string) {
        //rssUrl.name = rssUrl.name + ' modif';
        console.log(rssUrl);
        const itemDoc = this.db.doc<RssUrl>(`users/${userEmail}/rss-url/${rssUrl.id}`);
        itemDoc.update(rssUrl);
    }

    /**
     * 
     * Suppression RSS
     * 
     * @param rssUrl 
     * 
     */
    deleteRssUrl(rssUrl: RssUrl, userEmail: string): Promise<void> {
        const itemDoc = this.db.doc<RssUrl>(`users/${userEmail}/rss-url/${rssUrl.id}`);
        return itemDoc.delete();
    }

    /**
     * 
     * Chargement des feeds des url passées an paramètre
     * Cache permet de savoir si on récup les valeurs du cache
     * 
     * @param rssUrls 
     * @param cache 
     */
    getFeedFromUrls(rssUrls: RssUrl[], cache: boolean) {
        
        console.log('getFeedFromUrls = ', rssUrls);
        if (cache && this.cacheFeeds.length > 0) {

            console.log('getFeedFromUrls from cache');
            this.feedLoading.next(this.cacheFeeds);
            
            // NGRX
            this.store.dispatch(new Rss.setLoading(false));
            return;
        }

        console.log('getFeedFromUrls no cache');

        const url = constants.FEED_FROM_URL;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        const rss = {
            rssUrls: rssUrls
        }
        this.http.post(url, rss, {headers: headers}).subscribe(
            res => {

                // NGRX
                this.store.dispatch(new Rss.setLoading(false));

                console.log(res.json());
                this.cacheFeeds = res.json();
                this.cacheFeeds .sort((val1, val2)=> {
                return <any>(new Date(val2.pubDate)) - <any>(new Date(val1.pubDate))})
                this.feedLoading.next(this.cacheFeeds);
            },
            (err) => {

                // NGRX
                this.store.dispatch(new Rss.setLoading(false));

                console.log(err);
            }
        );
    }

    /**
     * 
     * Détermine si une URL RSS est valide, cad a au moins un feeds
     * 
     * @param rssUrl 
     */
    async isUrlFeedValid(rssUrl: RssUrl): Promise<boolean>{
        
        const url = constants.FEED_FROM_URL;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        const rss = {
            rssUrls: [rssUrl]
        }

        return this.http.post(url, rss, {headers: headers}).toPromise()
                  .then (res => res.json().length > 1)
                  .catch (err => false)
    }

    /**
     * 
     * Filtrage des feeds suivant category / rss name
     * 
     * @param filters 
     */
    applyFilters(filters: any) {
    
        let filteredFeeds = this.cacheFeeds;

        if (filters.category !== constants.CATEGORY_ALL) {
            filteredFeeds = filteredFeeds.filter(
                feed => feed.category === filters.category
            );
        }

        if (filters.rssName !== constants.RSS_NAME_ALL) {
            filteredFeeds = filteredFeeds.filter(
                feed => feed.rssName === filters.rssName
            );
        }

        this.feedLoading.next(filteredFeeds);

    }


    /**
     * 
     * Getter sur champs privés
     * 
     * 
     */
    getRssNames() {
        return {...this.rssNames}
    }

    getCategories() {
        return {...this.categories}
    }

    /**
     * 
     * Recherche des url RSS par mots clef
     * 
     * @param keywords 
     * 
     */
    searchRssUrls(keywords: string) {
        
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

        this.http.post(constants.URL_FEEDLY, {keywords}, {headers: headers}).subscribe(
          (rssUrls: any) => {
            
            console.log(JSON.parse(rssUrls._body).results);
            const arrayRssUrls = JSON.parse(rssUrls._body).results.map(rssUrl => {
                return this.convertToRssUrls(rssUrl);
            })

            console.log("arrayRssUrls = " , arrayRssUrls.sort(this.compare));
            this.rssUrlsResultSearch.next(arrayRssUrls.sort(this.compare));

          },
          (error) => {
            console.log(error);
          }
        );
      }

    /**
     * 
     * Ajout RSS URL à Firestore
     * 
     * @param rssUrl 
     * 
     */
    addRssUrl(rssUrl: RssUrl, userEmail: string): Promise<any> {
        return this.db.collection(`users/${userEmail}/rss-url`).doc(rssUrl.id).set(rssUrl);
    }

    /**
     * 
     * Converti une rss url trouvée par la recherche en RssUrl
     * 
     * @param rssUrl 
     */
    convertToRssUrls(rssUrl: any): RssUrl {
    
        return {
            id: undefined,
            name:  rssUrl.title,
            url: rssUrl.feedId.substring(constants.URL_RSS_PREFIX.length),
            category: rssUrl.hint,
            email: undefined,
            active: true,
            icon: rssUrl.iconUrl
        }
    }


    /**
     * 
     * Fonction de comparaison sur les noms rss pour tri
     * 
     * @param a 
     * @param b 
     */
    compare(a,b) {
        if (a.name < b.name)
          return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      }
      

}