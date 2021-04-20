import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.userService.isLoggedIn) {
      localStorage.clear();
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
