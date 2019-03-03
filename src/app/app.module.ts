import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MisceallousComponent } from './misceallous/misceallous.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { HttpModule } from '@angular/http';
import { ProjectsComponent } from './projects/projects.component';
import { ContactService } from './services/contact.service';
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { ConnectedModule } from './connected/connected.module';

const routes: Routes = [
  { path: 'connected', redirectTo: 'connected', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutMeComponent,
    MisceallousComponent,
    ContactComponent,
    FooterComponent,
    ProjectsComponent,
    ModalLoginComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ConnectedModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'en', 
    },
    ContactService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
