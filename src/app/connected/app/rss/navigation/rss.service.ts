import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class RssService {

    constructor(private httpClient: HttpClient, private http: Http) {}

    getRssDatas() {


    }
}