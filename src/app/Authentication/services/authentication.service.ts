import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { constants } from '../../../helpers/constants';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) {}

    cretateMongoUser(user: any): Observable<Response> {

        const url = constants.MONGO_CREATE_USER;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        return this.http.post(url, user, {headers: headers});
        //return this.http.post(url, user);
    }

}