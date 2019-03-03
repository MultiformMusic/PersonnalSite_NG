import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {

  @ViewChild('modalLogin') modalLogin: any;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  openModal() {

    this.modalLogin.nativeElement.style.display = 'block';
    setTimeout( () => {
      this.modalLogin.nativeElement.className = 'modal fade show';
    }, 100)
  }

  closeModal() {
    
    this.modalLogin.nativeElement.className = 'modal fade';
    setTimeout( () => {
      this.modalLogin.nativeElement.style.display = 'none';
    }, 100)
    
  }

  loginOK() {

    this.modalLogin.nativeElement.className = 'modal fade';
    setTimeout( () => {
      this.modalLogin.nativeElement.style.display = 'none';
    }, 100)

    this.router.navigate(['/connected/home']);
  }


}
