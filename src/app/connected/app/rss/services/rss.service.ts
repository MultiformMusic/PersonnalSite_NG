import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs';
import  { constants } from '../../../../../helpers/constants';

@Injectable()
export class RssService {

    /**
     * Emission événements :
     * - début chargement : pour afficher "Loading"
     * - chargement des feeds
     * => mise en cache des feeds
     */
    beginLoading = new Subject<boolean>();
    feedLoading = new Subject<any>();
    cacheFeeds: any[] = [];

    constructor(private http: Http) {}

    /**
     * 
     * Chargement des feeds des url passées an paramètre
     * Cache permet de savoir si on récup les valeurs du cache
     * 
     * @param rssUrls 
     * @param cache 
     */
    getFeedFromUrls(rssUrls: string[], cache: boolean) {
        
        if (cache && this.cacheFeeds.length > 0) {
            console.log('from cache');
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
}