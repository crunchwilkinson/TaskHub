import { CanActivateFn, Router} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

  // If the service finds a JWT in localStorage, let them in
  if (authService.isAuthenticated()) {
    return true;
  }

  // Otherwise, intercept the navigation and send them to the login screen
  return router.parseUrl('/login');
};