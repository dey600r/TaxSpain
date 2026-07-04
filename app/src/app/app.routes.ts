import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home';

export const routes: Routes = [
  { path: '', redirectTo: 'cuenta-anual', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardHomeComponent },
  { path: 'cuenta-anual', component: DashboardComponent }
];
