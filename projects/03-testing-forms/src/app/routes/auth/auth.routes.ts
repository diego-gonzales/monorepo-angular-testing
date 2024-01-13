import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@routes/auth/auth.component'),
    children: [
      {
        path: 'login',
        loadComponent: () => import('@routes/auth/login/login.component'),
      },
      {
        path: 'register',
        loadComponent: () => import('@routes/auth/register/register.component'),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
] as Route[];
