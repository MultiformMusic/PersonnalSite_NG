import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'modal-signin',
  templateUrl: './modal-signin.component.html',
  styleUrls: ['./modal-signin.component.css']
})
export class ModalSigninComponent implements OnInit {

  @ViewChild('modalSignin') modalSignin: any;
  @ViewChild('modalContainer') modalContainer: any;

  constructor(private router: Router) { }

  ngOnInit() {

  }

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

  signinOK() {

    //this.modalLogin.nativeElement.className = 'modal fade';
    setTimeout( () => {
      this.modalSignin.nativeElement.style.display = 'none';
    }, 100)

    this.router.navigate(['/connected/home']);
  }

}
