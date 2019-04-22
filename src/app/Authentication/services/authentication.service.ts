import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { constants } from '../../../helpers/constants';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { EmailValidator } from '@angular/forms';

@Injectable()
export class AuthenticationService {
    
    jwtHelper: JwtHelperService;
    decodedToken: any;
    rawToken: string;

    constructor(private http: Http, 
                private db: AngularFirestore) {

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
     * Authentification de l'user email/password
     * 
     * @param email 
     * @param password 
     */
    public loginMongoUser(user: any): Observable<Response> {

        const url = constants.MONGO_LOGIN_USER;
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

        const authenticated: boolean = !this.jwtHelper.isTokenExpired(localStorage.getItem(constants.LOCALSTORAGE_TOKEN));    

        return authenticated;
    }

    /**
     * 
     * Renvoi un User à partir des infos stockées dans localstorage
     * 
     */
    getUserFromToken(): User {

        const userStorage = JSON.parse(localStorage.getItem(constants.LOCALSTORAGE_META_DATA));
        const user = new User();
        user._id = userStorage.userId;
        user.username = userStorage.username;
        user.email = userStorage.email;
        return user;
    }

    /**
     * 
     * Déconnexion utilisateur : RAZ des données d'authentification
     * 
     */
    public logout() {

        localStorage.removeItem(constants.LOCALSTORAGE_TOKEN);
        localStorage.removeItem(constants.LOCALSTORAGE_META_DATA);
    
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
        localStorage.setItem(constants.LOCALSTORAGE_TOKEN, token);
        localStorage.setItem(constants.LOCALSTORAGE_META_DATA, JSON.stringify(this.decodedToken));
        return token;
    }

    /**
     * 
     * Ajoute un utilisateur à la db FIRESTORE
     * 
     */
    public addUserToDb(user: any): Promise<any> {

        const userDb = {
            id: user.email,
            username: user.username,
        }
        return this.db.collection('users').doc(userDb.id).set(userDb);
    }

    /**
     * 
     * Ajoute les categories par défaut à l'utilisateur créé
     * 
     * @param userEmail 
     * 
     */
    public addCategoriesToUser(userEmail: string) {

        const categories = [
            {name: 'News'}, 
            {name: 'Science'}, 
            {name: 'Informatic'}, 
            {name: 'Misceallous'}, 
            {name: 'Music'},
            {name: 'Apple'},
            {name: 'Android'},
        ];

        categories.map((category: any) => {
            this.db.collection(`users/${userEmail}/categories`).doc(category.name).set(category);
        });
    }
}