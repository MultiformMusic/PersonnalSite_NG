import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalSigninComponent } from './modal-signin/modal-signin.component';
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { EqualValidator } from './directives/equal-validator.directive';

@NgModule({

    declarations: [
        ModalSigninComponent,
        ModalLoginComponent,
        EqualValidator
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