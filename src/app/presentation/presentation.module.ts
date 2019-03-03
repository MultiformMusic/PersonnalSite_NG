import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PresentationComponent } from './presentation.component';
import { HeaderComponent } from '../header/header.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { MisceallousComponent } from '../misceallous/misceallous.component';
import { ContactComponent } from '../contact/contact.component';
import { FooterComponent } from '../footer/footer.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { ContactService } from '../services/contact.service';

const routes: Routes = [
    { path: '', 
     component: PresentationComponent,
     children: [
         { path: 'presentation', component: PresentationComponent },
     ]
    }
];


@NgModule({

    declarations: [   
        PresentationComponent,
        HeaderComponent,
        AboutMeComponent,
        MisceallousComponent,
        ContactComponent,
        FooterComponent,
        ProjectsComponent,
        ModalLoginComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [
    {
        provide: RECAPTCHA_LANGUAGE,
        useValue: 'en', 
        },
        ContactService
    ]
})
export class PresentationModule {

}