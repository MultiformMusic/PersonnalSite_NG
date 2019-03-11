import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { constants } from '../../../helpers/constants';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) {}

    cretateMongoUser(user: any): Observable<Response> {

        const url = constants.MONGO_CREATE_USER;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        return this.http.post(url, user, {headers: headers}).pipe(
            map(res => {
                this.saveToken(res.json())
                return res.json();
            })
        );
        //return this.http.post(url, user);
    }

    private saveToken(token: string): string {

        //this.decodedToken = jwt.decode(token);
        localStorage.setItem('psng_auth', token);
        //localStorage.setItem('bwm_meta', JSON.stringify(this.decodedToken));
        return token;
    }
}