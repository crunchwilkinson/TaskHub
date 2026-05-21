import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard] // Protect this route with our AuthGuard
    },
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'}, // Default route
    {path: '**', redirectTo: '/dashboard'} // Wildcard route for a 404 page (optional)
];
