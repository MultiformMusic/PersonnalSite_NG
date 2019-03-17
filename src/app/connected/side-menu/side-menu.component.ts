import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Authentication/services/authentication.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  user:User;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.user = this.authenticationService.getUserFromToken();
  }

}
