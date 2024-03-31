import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);

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
