import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs';
import  { constants } from '../../../../../helpers/constants';
import { AngularFirestore } from '@angular/fire/firestore';
import { RssUrl } from './../models/rss-url';

@Injectable()
export class RssService {

    /**
     * Emission événements :
     * - début chargement : pour afficher "Loading"
     * - chargement des feeds
     * => mise en cache des feeds
     */
    rssUrlsLoading = new Subject<RssUrl[]>();
    beginLoading = new Subject<boolean>();
    feedLoading = new Subject<any>();

    // feeds en cache
    cacheFeeds: any[] = [];

    // permet de savoir l'appelant : REFRESH (click refresh), CALLER_LIST (component list)
    caller: string = '';

    /**
     * 
     * Nécessaire aux filtrages
     * 
     */
    rssNames: string[] = [];
    categories: string[] = [];

    constructor(private http: Http,
                private db: AngularFirestore) {}


    /**
     * 
     * Chargement des url rss depuis la base firestore
     * Le caller permet de savoir qui appelle : REFRESH, CALLER_LIST
     * 
     */
    loadUrlRssFromDatabase(caller: string) {

        console.log('loadUrlRssFromDatabase');

        // ré-initialisation
        this.categories = [];
        this.rssNames = [];

        this.caller = caller;

        this.db.collection('rss-url').valueChanges().subscribe(
            (rssUrlsArray: RssUrl[]) => {
                let resultRssUrl = rssUrlsArray.map(rssUrl => {
                    
                    // si l'url est active on récup rssName et Category pour filtres
                    if (rssUrl.active) {
                        this.rssNames.push(rssUrl.name);
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
                this.categories.unshift(constants.CATEGORY_ALL);
                this.rssNames.unshift(constants.RSS_NAME_ALL);
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
        if (this.caller !== constants.CALLER_REFRESH && cache && this.cacheFeeds.length > 0) {
            this.feedLoading.next(this.cacheFeeds);
            return;
        }

        this.beginLoading.next(true);

        const url = constants.FEED_FROM_URL;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        const rss = {
            rssUrls: rssUrls
        }
        this.http.post(url, rss, {headers: headers}).subscribe(
            res => {
                console.log(res.json());
                this.beginLoading.next(false);
                this.cacheFeeds = res.json();
                this.cacheFeeds .sort((val1, val2)=> {
                    return <any>(new Date(val2.pubDate)) - <any>(new Date(val1.pubDate))})
                this.feedLoading.next(this.cacheFeeds);
            },
            (err) => {
                this.beginLoading.next(false);
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