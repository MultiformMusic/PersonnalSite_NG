import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthenticationService } from '../Authentication/services/authentication.service';
import { secureConstants } from '../../helpers/secureConstants';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.css']
})
export class ConnectedComponent implements OnInit {

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    
    this.authService.loginFirebase(secureConstants.FIREBASE_EMAIL, secureConstants.FIREBASE_PASSWORD)
                    .then(
                      credential => console.log('credential OK')
                    ).catch(
                      err => console.log(err)
                    );
  }

}
