import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ConnectedModule } from './connected/connected.module';
import { PresentationModule } from './presentation/presentation.module';

const routes: Routes = [
  { path: '', redirectTo: 'presentation', pathMatch: 'full'},
  { path: 'connected', redirectTo: 'connected', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    PresentationModule,
    ConnectedModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
