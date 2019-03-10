import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'modal-signin',
  templateUrl: './modal-signin.component.html',
  styleUrls: ['./modal-signin.component.css']
})
export class ModalSigninComponent implements OnInit {

  @ViewChild('modalSignin') modalSignin: any;
  @ViewChild('modalContainer') modalContainer: any;

  signinForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  /** Initialisation du formulaire (reactive forms) */
  initForm() {

      this.signinForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
        password: ['', [Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$')]],
        confirmpassword: ['', Validators.required]
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

  signin() {

    //this.modalLogin.nativeElement.className = 'modal fade';
    setTimeout( () => {
      this.modalSignin.nativeElement.style.display = 'none';
    }, 100)

    this.router.navigate(['/connected/home']);
  }

}
