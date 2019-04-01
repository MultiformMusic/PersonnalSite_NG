import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import  { constants } from '../../../../../helpers/constants';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class RssService {

    /**
     * Emission événements :
     * - début chargement : pour afficher "Loading"
     * - chargement des feeds
     * => mise en cache des feeds
     */
    rssUrlsLoading = new Subject<any>();
    beginLoading = new Subject<boolean>();
    feedLoading = new Subject<any>();
    cacheFeeds: any[] = [];

    rssUlrs: any[];

    constructor(private http: Http,
                private db: AngularFirestore) {}


    loadUrlRssFromDatabase() {

        this.db.collection('rss-url').valueChanges().subscribe(
            rssUrlsArray => {
                let resultRssUrl = rssUrlsArray.map(rssUrl => {
                    return {
                        ...rssUrl
                    }
                })

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
    getFeedFromUrls(rssUrls: any[], cache: boolean) {
        
        if (cache && this.cacheFeeds.length > 0) {
            this.feedLoading.next(this.cacheFeeds);
            console.log('from cache');
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
}