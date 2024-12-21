import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'sales',
    loadChildren: () => import('./features/sales/sales.routes').then(m => m.SALES_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'accounting',
    loadChildren: () => import('./features/accounting/accounting.routes').then(m => m.ACCOUNTING_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  }
];