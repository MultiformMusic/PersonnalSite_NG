import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { constants } from '../../../helpers/constants';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    
    jwtHelper: JwtHelperService;
    decodedToken: any;
    rawToken: string;

    constructor(private http: Http) {

        this.jwtHelper = new JwtHelperService();
    }

    /**
     * 
     * Création d'un utilisateur en base mongo
     * Sauvegarde du token retourné par le backend dans le localstorage
     * 
     */
    public cretateMongoUser(user: any): Observable<Response> {

        const url = constants.MONGO_CREATE_USER;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        return this.http.post(url, user, {headers: headers}).pipe(
            map(res => {
                const token = res.json();
                this.saveToken(token);
                return token;
            })
        );
    }
    
    /**
     * 
     * Détermine si l'user à son token toujours valable
     * 
     */
    public isAuthenticated(): boolean {

        debugger;

        const authenticated: boolean = !this.jwtHelper.isTokenExpired(localStorage.getItem('psng_auth'));    

        return authenticated;
    }

    /**
     * 
     * Déconnexion utilisateur : RAZ des données d'authentification
     * 
     */
    public logout() {

        localStorage.removeItem('psng_auth');
        localStorage.removeItem('psng_meta');
    
        this.decodedToken = {};
        this.rawToken = '';
    }

    /**
     * 
     * Sauvegarde du token et des infos décodés dans localstorage
     * 
     * @param token 
     */
    private saveToken(token: string): string {

        const helper = new JwtHelperService();
        this.decodedToken = helper.decodeToken(token);
        this.rawToken = token;
        localStorage.setItem('psng_auth', token);
        localStorage.setItem('psng_meta', JSON.stringify(this.decodedToken));
        return token;
    }
}