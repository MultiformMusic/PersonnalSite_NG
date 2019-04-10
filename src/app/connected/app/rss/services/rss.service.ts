import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs';
import  { constants } from '../../../../../helpers/constants';
import { AngularFirestore } from '@angular/fire/firestore';
import { RssUrl } from './../models/rss-url';
import { AuthenticationService } from 'src/app/Authentication/services/authentication.service';
import { User } from 'src/app/models/user.model';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../connected.reducer';
import * as Rss from '../ngrx/rss.actions';

@Injectable()
export class RssService {

    /**
     * Emission événements :
     * - début chargement : pour afficher "Loading"
     * - chargement des feeds
     * => mise en cache des feeds
     */
    rssUrlsLoading = new Subject<RssUrl[]>();
    feedLoading = new Subject<any>();

    // feeds en cache
    cacheFeeds: any[] = [];

    /**
     * 
     * Nécessaire aux filtrages
     * 
     */
    rssNames: string[] = [];
    categories: string[] = [];

    constructor(private http: Http,
                private authService: AuthenticationService,
                private db: AngularFirestore,
                private store: Store<fromRoot.State>) {}


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

        this.db.collection('rss-url', ref => ref.where('email','==', user.email )).valueChanges().subscribe(
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
                console.log('loadUrlRssFromDatabase categorie = ', this.categories);
                console.log('loadUrlRssFromDatabase rssNames = ', this.rssNames);
                this.rssUrlsLoading.next(resultRssUrl);
            }
        );
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
        
        console.log('getFeedFromUrls');
        debugger;
        if (cache && this.cacheFeeds.length > 0) {

            this.feedLoading.next(this.cacheFeeds);
            
            // NGRX
            this.store.dispatch(new Rss.setLoading(false));
            return;
        }

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
}