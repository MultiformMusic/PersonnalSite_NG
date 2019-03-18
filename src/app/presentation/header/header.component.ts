import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Authentication/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
  }

  /**
   * 
   * N avigation vers la page personnelle
   * 
   */
  personnal() {
    this.router.navigate(['connected']);
  }


  /**
   * 
   * Log out de l'utilisateur
   * 
   */
  logout() {
    this.authenticationService.logout();
  }
}
