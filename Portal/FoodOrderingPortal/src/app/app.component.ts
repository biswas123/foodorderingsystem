import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FoodOrderingPortal';

  opened: boolean;
  isLoggedIn$: Observable<boolean>;
  showLogoutBtn: boolean;
  showBackBtn: boolean;
  public loading = false;


  constructor(private authService: AuthService, private router: Router, private location: Location) {

  }


  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;

    this.showLogoutBtn = false;
    this.showBackBtn = false;
  /*   if (this.isLoggedIn$) {
      this.router.navigate(['/']);
    } */
  }

  onLogout() {
    this.opened = false;
    this.authService.logout();
  }


  onBackClick() {
    this.location.back();
  }
}
