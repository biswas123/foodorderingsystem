
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../objects/user';
import { APIService } from '../api/api.service';
import { GenericDialogComponent } from 'src/app/dialogs/generic-dialog/generic-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isSessionPresent()); 

  get isLoggedIn() {
    return this.loggedIn.asObservable(); 
  }

  constructor(
    private router: Router,
    private apiService : APIService,
    private messageDialog: GenericDialogComponent) {}

  isSessionPresent() {
    return (sessionStorage.session && sessionStorage.session == '1')  ? true : false;
  }

  login(user: User){
    if (user.userName !== '' && user.password !== '' ) { 

      var objParam  = {
        "username": user.userName,
        "password": user.password,
        "call" : "login"
      };

      this.apiService.login(objParam).subscribe((data) => {
        if(data.Status == 200 && data.Message == "Success" ) {
          this.loggedIn.next(true);
          sessionStorage.session = "1";
          this.router.navigate(['/']);
        }
      }, (error) => {
        console.log(error);
        this.messageDialog.displayMessageDialog("Invalid username or password.");
      });
    }
  }

  logout() {      
                    
    this.loggedIn.next(false);
    sessionStorage.session = "0";
    this.router.navigate(['/login']);
  }
}