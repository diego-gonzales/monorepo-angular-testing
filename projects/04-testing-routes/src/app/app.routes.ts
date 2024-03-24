import { Routes } from '@angular/router';

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
];
