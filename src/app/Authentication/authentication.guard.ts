import { CanActivate } from "@angular/router/src/utils/preactivation";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./services/authentication.service";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

    private url: string;

    constructor(private authenticationService: AuthenticationService,
                private router: Router,
                private toastr: ToastrService) {}


    /**
     * 
     * Détermination si route accessible suivant url / user authentifié
     * 
     * @param next 
     * @param state 
     */
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        const authenticated = this.authenticationService.isAuthenticated();

        if (state.url.includes('connected') && !authenticated) {
            this.toastr.error('', 'Your must be authenticated to access this ressource');
            this.router.navigate(['/']);
            return false;
        }
        
        return authenticated;
    }            
}