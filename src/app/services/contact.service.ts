import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Contact } from 'src/models/contact.model';

@Injectable()
export class ContactService {

    constructor(private http: Http) {}

    sendEmail(contact: Contact) {

        const url = `https://us-central1-personnalsite-c7bef.cloudfunctions.net/httpEmail`;
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