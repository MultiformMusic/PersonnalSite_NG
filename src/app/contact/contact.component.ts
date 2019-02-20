import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Contact } from 'src/models/contact.model';
import { debug } from 'util';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @ViewChild('f') contactForm: NgForm;
  contact: Contact = new Contact('', '', '')
  sendingOK = false;

  constructor(private http: Http) { }

  ngOnInit() {
  }


  sendEmail() {

    this.contact.email = this.contactForm.value.email;
    this.contact.name = this.contactForm.value.name;
    this.contact.message = this.contactForm.value.message;

    let url = `https://us-central1-personnalsite-c7bef.cloudfunctions.net/httpEmail`;
    let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    this.http.post(url, this.contact, {headers: headers}).subscribe(
      (response: Response) => {
        console.log("RESSSS = ", response.status);
        this.sendingOK = true;
      }
    );
    
  }
}
