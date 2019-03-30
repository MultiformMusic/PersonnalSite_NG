import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs';
import  { constants } from '../../../../../helpers/constants';

@Injectable()
export class RssService {

    feedLoading = new Subject<any>();
    beginLoading = new Subject<boolean>();

    constructor(private http: Http) {}

    getFeedFromUrls(rssUrls: string[]) {
        
        this.beginLoading.next(true);

        const url = constants.FEED_FROM_URL;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        const rss = {
            rssUrls: rssUrls
        }
        this.http.post(url, rss, {headers: headers}).subscribe(
            res => {
                //console.log(res.json());
                this.beginLoading.next(false);
                this.feedLoading.next(res.json());
            },
            (err) => {
                this.beginLoading.next(false);
                console.log(err);
            }
        );
    }
}