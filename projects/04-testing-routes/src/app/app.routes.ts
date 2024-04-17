import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('@components/products/products.component'),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('@components/product-detail/product-detail.component'),
  },
  {
    path: 'auth',
    loadChildren: () => import('@routes/auth/auth.routes'),
  },
  {
    path: 'other',
    canActivate: [authGuard],
    loadComponent: () => import('@components/other/other.component'),
  },
];
