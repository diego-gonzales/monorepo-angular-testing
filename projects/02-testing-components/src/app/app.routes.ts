import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('@components/products/products.component'),
  },
  {
    path: 'milligram-css',
    loadComponent: () =>
      import('@components/milligram-css/milligram-css.component'),
  },
  {
    path: 'people',
    loadComponent: () => import('@components/people/people.component'),
  },
];
