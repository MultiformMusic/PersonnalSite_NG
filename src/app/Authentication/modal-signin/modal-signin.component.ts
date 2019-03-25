import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { constants } from '../../../helpers/constants';
import { AuthenticationService } from '../services/authentication.service';
import { Response } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

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
  callCloudFunction: boolean = false;

  constructor(private router: Router, 
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private toastr: ToastrService) { }

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

  /** Début validation du formulaire */
  isInvalidForm(fieldName: string): boolean {

    return this.signinForm.controls[fieldName].invalid && 
           (this.signinForm.controls[fieldName].dirty || this.signinForm.controls[fieldName].touched);
  }

  isRequired(fieldName: string): boolean {
    return this.signinForm.controls[fieldName].errors.required;
  }
  /** Fin validation du formulaire */

  /** Gestion Modal */
  openModal() {

    this.modalSignin.nativeElement.style.display = 'block';
    setTimeout( () => {
      this.modalSignin.nativeElement.className = 'modal fade show modal-transition-in';
    }, 100)
  }

  closeModal() {
    
    this.signinForm.reset();
    this.errors = [];

    this.modalSignin.nativeElement.className = 'modal fade modal-transition-in';
    setTimeout( () => {
      this.modalSignin.nativeElement.style.display = 'none';
    }, 200)
    
  }
  /** Fin Gestion Modal */

  /**
   * 
   * Rest le confirm password si le password est modifié
   * 
   */
  resetConfirmPassword() {
    this.signinForm.patchValue({
      confirmpassword: ''
    });
  }

   /**
   * 
   * Détection enter key positionné sur input
   * 
   * @param event 
   */
  onKeydown(event) {
    if (event.key === "Enter" && this.signinForm.valid) {
       this.signin(); 
    }
  }
  
  /**
   * Enregistrement nouvel utilisateur
   * 
   * - création utilisateur base mongo
   * - token sauvegardée par le service d'authentification
   * - affichage toaster succés => redirection vers connected/home
   * 
   */
  signin() {

    this.callCloudFunction = true;
    this.errors = [];

    const user = {
      username: this.signinForm.get('username').value,
      email: this.signinForm.get('email').value,
      password: this.signinForm.get('password').value,
      confirmpassword: this.signinForm.get('confirmpassword').value
    }

    this.authenticationService.cretateMongoUser(user).subscribe(
      (res: Response) => {
        setTimeout( () => {
          this.callCloudFunction = false;
          this.modalSignin.nativeElement.style.display = 'none';
          //this.toastr.success('', 'Welcome to your personnal page');
          this.router.navigate(['/connected/home']);
          location.reload();
        }, 100)
      },
      (errorResponse) => {
        this.callCloudFunction = false;
        this.errors = [];
        this.errors.push(JSON.parse(errorResponse._body).errors[0]);
      }
    );
  }

}
