import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';

import { User } from '../model/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscriptions = new SubSink();
  user: User;
  token: string;
  tokenExpirationDate: Date | null;
  buttonText = 'Show Token';
  showLoading: boolean;


  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.getUserFromCache();
    this.token = this.userService.getTokenFromCache();
    this.tokenExpirationDate =  this.userService.getTokenExpirationDate();
  }

  onUpdateUser(): void {
    this.showLoading = true;
    const currentUsername = this.userService.getUserFromCache().username;
    const formData = this.userService.createUserFormData(currentUsername, this.user);
    this.subscriptions.add(
      this.userService.updateUser(formData).subscribe(
        (user: User) => {
          this.showLoading = false;
          this.userService.addUserToCache(user);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.showLoading = false;
        }
      )
    );
  }

  onResetPassword(email: string): void{
    const currentEmail = this.userService.getUserFromCache().email;
    this.userService.resetPassword(currentEmail).subscribe(
      (response) => {
        alert('Password successfully reset!');
        this.logOut();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  onDeleteUser(username: string): void {
    this.subscriptions.add(
      this.userService.delete(username).subscribe(
        (response) => {
          this.logOut();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    );
  }

  logOut(): void {
    this.userService.logOut();
    this.router.navigateByUrl('/login');
  }

  setButtonText() : void {
    if(this.buttonText === 'Show Token'){
      this.buttonText = 'Hide Token';
    }else{
      this.buttonText = 'Show Token';
    }
  }

  copyTokenToClipboard(): void{
    const range = document.createRange();
    const tokenContainerId: any = document.getElementById('token-container');
    range.selectNode(tokenContainerId);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    document.getElementById('clipboard-modal')?.click();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
