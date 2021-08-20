import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { User } from '../model/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-userlists',
  templateUrl: './userlists.component.html',
  styleUrls: ['./userlists.component.css']
})
export class UserlistsComponent implements OnInit {

  public users: User[] | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void{
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        console.log(this.users)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
}
