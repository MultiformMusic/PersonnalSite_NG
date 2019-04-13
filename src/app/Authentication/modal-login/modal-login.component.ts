import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Response } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {

  @ViewChild('modalLogin') modalLogin: any;
  @ViewChild('modalContainer') modalContainer: any;

  loginForm: FormGroup;
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

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  /** Gestion MODAL */
  openModal() {

    this.modalLogin.nativeElement.style.display = 'block';
    setTimeout( () => {
      this.modalLogin.nativeElement.className = 'modal fade show modal-transition-in';
    }, 100)
  }

  closeModal() {
    
    this.loginForm.reset();
    this.errors = [];

    this.modalLogin.nativeElement.className = 'modal fade modal-transition-in';
    setTimeout( () => {
      this.modalLogin.nativeElement.style.display = 'none';
    }, 200)
    
  }

  /** Début validation du formulaire */
  isInvalidForm(fieldName: string): boolean {

    return this.loginForm.controls[fieldName].invalid && 
           (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched);
  }

  isRequired(fieldName: string): boolean {

    return this.loginForm.controls[fieldName].errors.required;
  }
  /** Fin validation du formulaire */

  /**
   * 
   * Détection enter key positionné sur input
   * 
   * @param event 
   */
  onKeydown(event) {
    if (event.key === "Enter" && this.loginForm.valid) {
       this.login(); 
    }
  }

  /**
   * Authentification utilisateur
   * 
   * - authentification utilisateur base mongo
   * - token sauvegardée par le service d'authentification
   * - affichage toaster succés => redirection vers connected/home
   * 
   */
  login() {

    this.callCloudFunction = true;
    this.errors = [];

    const user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }

    this.authenticationService.loginMongoUser(user).subscribe(
      (res: Response) => {

        this.callCloudFunction = false;
        this.modalLogin.nativeElement.style.display = 'none';
        this.router.navigate(['/connected/home']);

        setTimeout(() => {
          location.reload();
        }, 1);

      },
      (errorResponse) => {
        this.callCloudFunction = false;
        this.errors = [];
        this.errors.push(JSON.parse(errorResponse._body).errors[0]);
      }
    );

  }
  
}
