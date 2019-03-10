import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalSigninComponent } from './modal-signin/modal-signin.component';
import { ModalLoginComponent } from './modal-login/modal-login.component';

@NgModule({

    declarations: [
        ModalSigninComponent,
        ModalLoginComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],

    exports: [
        ModalSigninComponent,
        ModalLoginComponent 
    ]
})
export class AuthenticationModule {

}