import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { constants } from '../../../helpers/constants';
import { AuthenticationService } from '../services/authentication.service';
import { Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'modal-signin',
  templateUrl: './modal-signin.component.html',
  styleUrls: ['./modal-signin.component.css']
})
export class ModalSigninComponent implements OnInit {

  @ViewChild('modalSignin') modalSignin: any;
  @ViewChild('modalContainer') modalContainer: any;

  signinForm: FormGroup;
  errors: any[] = [];

  constructor(private router: Router, 
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.initForm();
  }

  /** Initialisation du formulaire (reactive forms) */
  initForm() {

      this.signinForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.pattern(constants.PATTERN_EMAIL)]],
        password: ['', [Validators.required, Validators.pattern(constants.PATTERN_PASSWORD)]],
        confirmpassword: ['', [Validators.required, Validators.pattern(constants.PATTERN_PASSWORD)]]
      });
  }

  /** Début validation du formulaier */
  isInvalidForm(fieldName: string): boolean {

    return this.signinForm.controls[fieldName].invalid && 
           (this.signinForm.controls[fieldName].dirty || this.signinForm.controls[fieldName].touched)
  }

  isRequired(fieldName: string): boolean {
    return this.signinForm.controls[fieldName].errors.required
  }
  /** Fin validation du formulaier */

  /** Gestion Modal */
  openModal() {

    this.modalSignin.nativeElement.style.display = 'block';
    setTimeout( () => {
      this.modalSignin.nativeElement.className = 'modal fade show modal-transition-in';
    }, 100)
  }

  closeModal() {
    
    this.modalSignin.nativeElement.className = 'modal fade modal-transition-in';
    setTimeout( () => {
      this.modalSignin.nativeElement.style.display = 'none';
    }, 200)
    
  }
  /** Fin Gestion Modal */

  resetConfirmPassword() {
    this.signinForm.patchValue({
      confirmpassword: ''
    });
  }
  
  signin() {

    const user = {
      username: this.signinForm.get('username').value,
      email: this.signinForm.get('email').value,
      password: this.signinForm.get('password').value,
      confirmpassword: this.signinForm.get('confirmpassword').value
    }

    this.authenticationService.cretateMongoUser(user).subscribe(
      (res: Response) => {
        console.log(res);
        setTimeout( () => {
          this.modalSignin.nativeElement.style.display = 'none';
          this.router.navigate(['/connected/home']);
        }, 100)
      },
      (errorResponse) => {
        this.errors.push(JSON.parse(errorResponse._body).errors[0]);
      }
    );

    //this.modalLogin.nativeElement.className = 'modal fade';
  }

}
