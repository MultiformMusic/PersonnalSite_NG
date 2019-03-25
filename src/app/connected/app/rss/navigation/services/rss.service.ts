import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs';
import  { constants } from '../../../../../../helpers/constants';

@Injectable()
export class RssService {

    private feeds = [];
    feedLoading = new Subject<any>();

    constructor(private http: Http) {}

    getFeedFromUrl(rssUrl: string) {
        
        debugger;

        const url = constants.FEED_FROM_URL;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        const rss = {
            rssUrls: rssUrl
        }
        this.http.post(url, rss, {headers: headers}).subscribe(
            res => {
                debugger;
                console.log(res.json().items);
                this.feedLoading.next(res.json().items);
            },
            (err) => {
                console.log(err);
            }
        );
        //this.http.post(url, rssUrl, {headers: headers});
    }
}