import { Component, OnInit, ViewChild, SecurityContext } from '@angular/core';

import { Response } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Contact } from 'src/models/contact.model';
import { ContactService } from '../services/contact.service';
import { DomSanitizer } from '@angular/platform-browser';
import { debug } from 'util';

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
  sendingOK = true;
  messageSending = '';

  constructor(private contactService: ContactService, 
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  clearSubmitOk() {
    this.sendingOK = false;
    this.messageSending = '';
  }

  sendContactMessage() {
  
    this.contact.email = this.sanitizer.sanitize(SecurityContext.HTML, this.contactForm.value.email);
    this.contact.name = this.sanitizer.sanitize(SecurityContext.HTML, this.contactForm.value.name);
    this.contact.message = this.sanitizer.sanitize(SecurityContext.HTML, this.contactForm.value.message);

    /* Envoi du mail */
    this.contactService.sendEmail(this.contact).subscribe(
      (response: Response) => {
        if (response.status == 200) {
          this.sendingOK = true;
          this.messageSending = 'Your message has been sent';
          this.contactForm.reset();
          this.formModel.captcha = '';
        } else {
          this.sendingOK = false;
          this.messageSending = 'Error while sending your message, please try later';
          this.formModel.captcha = '';
        }
      }
    );

    /** sauvegarde message dans Firebase */
    this.contactService.storeContact(this.contact).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );

  }
}
