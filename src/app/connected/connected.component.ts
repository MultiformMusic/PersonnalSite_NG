import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.css']
})
export class ConnectedComponent implements OnInit {

  reload: boolean = true;

  constructor(private router: Router) { 

    /*this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }*/

    /*this.router.events.subscribe(
      evt => {

        if (evt instanceof NavigationEnd) {
          debugger;
          if (this.reload) {
            this.router.navigated = false;
            this.reload = false;
            location.reload();
          }
          
        }
      }
    );*/
  }

  ngOnInit() {

  }

}
