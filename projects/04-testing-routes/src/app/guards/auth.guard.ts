import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);

  // this block of code is just to show how to get the params, data and queryParams from the route. You can see the test for this guard, to see how to test it (send params, data and queryParams to the guard through the route)
  const testingParams = route.params['productId'];
  const testingData = route.data['myData'];
  const testingQueryParams = route.queryParams['myQueryParams'];

  return _authService.getUser().pipe(
    map((user) => {
      if (!user) {
        _router.navigate(['/auth/login']);
        return false;
      }
      return true;
    }),
  );
};
