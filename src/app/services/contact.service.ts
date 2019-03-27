import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Contact } from 'src/models/contact.model';
import { Observable } from 'rxjs';
import { constants } from '../../helpers/constants'

@Injectable()
export class ContactService {

    constructor(private http: Http) {}

    sendEmail(contact: Contact): Observable<Response> {

        const url = constants.URL_CLOUD_MAIL;
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
        return this.http.post(url, contact, {headers: headers});
    }

    storeContact(contact: Contact) {

        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.post('https://personnalsite-c7bef.firebaseio.com/data.json', 
        [contact], 
        {headers: headers});
    }
}