import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contact } from 'src/models/contact.model';
import { constants } from '../../helpers/constants';
import { AuthenticationService } from '../Authentication/services/authentication.service';
import { secureConstants } from '../../helpers/secureConstants';

@Injectable()
export class ContactService {

    constructor(private http: Http,
                private fireStoreDb: AngularFirestore,
                private authService: AuthenticationService) {}

    sendEmail(contact: Contact): Observable<Response> {

        const url = constants.URL_CLOUD_MAIL;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        return this.http.post(url, contact, {headers: headers});
    }

    /*storeContact(contact: Contact) {

        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.post('https://personnalsite-c7bef.firebaseio.com/messages.json', 
        [contact], 
        {headers: headers});
    }*/

    /**
     * 
     * Enregistre le message du contact dans base firestore
     * Authentification firebase avec compte admin
     * 
     * @param contact 
     *
     */
    storeMessageContact(contact: Contact): Promise<void> {
            
        return this.authService.loginFirebase(secureConstants.FIREBASE_EMAIL, secureConstants.FIREBASE_PASSWORD)
                        .then(
                            (userCredential) => {
                                console.log(userCredential);
                                return this.fireStoreDb.collection(`users/michel.dio33@gmail.com/messages`).doc(contact.name).set(JSON.parse(JSON.stringify(contact)));
                            }
                        ).catch(
                            (error) => console.log(error)
                        );      
    }
}