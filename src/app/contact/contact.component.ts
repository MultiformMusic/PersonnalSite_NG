import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Contact } from 'src/models/contact.model';

export interface FormModel {
  captcha?: string;
}


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public formModel: FormModel = {};

  @ViewChild('captchaProtectedForm') contactForm: NgForm;
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

    alert("Send Message");

    this.sendingOK = true;
    this.contactForm.reset();
    this.formModel.captcha = '';

    /*this.http.post(url, this.contact, {headers: headers}).subscribe(
      (response: Response) => {
        console.log("RESSSS = ", response.status);
        this.sendingOK = true;
      }
    );*/
    
  }
}
