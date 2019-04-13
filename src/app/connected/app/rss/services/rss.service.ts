import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
    private rssNames: string[] = [];
    private categories: string[] = [];

    private rssUrlsCollection: AngularFirestoreCollection<RssUrl>;

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
        this.rssUrlsCollection = this.db.collection<RssUrl>('rss-url', ref => ref.where('email','==', user.email));
        debugger;

        // construction tableau Observable sur les rss url de la collection
        return this.rssUrlsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
              //console.log(a);
              const data = a.payload.doc.data() as RssUrl;
              const id = a.payload.doc.id;
              return {id, ...data };
            }))
        );
    }

    updateRssUrl(rssUrl: RssUrl) {
        debugger;
        const itemDoc = this.db.doc<RssUrl>('rss-url/' + rssUrl.id);
        itemDoc.update(rssUrl);
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