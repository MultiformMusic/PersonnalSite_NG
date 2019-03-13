import { CanActivate } from "@angular/router/src/utils/preactivation";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./services/authentication.service";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class AuthenticationGuard implements CanActivate {

    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

    private url: string;

    constructor(private authenticationService: AuthenticationService,
                private router: Router) {}


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

        debugger;

        const authenticated = this.authenticationService.isAuthenticated();

        if (state.url.includes('connected') && !authenticated) {
            this.router.navigate(['/']);
            return false;
        }
        
        return authenticated;
    }            
}