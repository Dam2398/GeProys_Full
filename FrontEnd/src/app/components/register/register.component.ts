import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  url = environment.API_URL

  public newUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }

  constructor(
    private httpClient: HttpClient,
    private router : Router  
  ) { }

  ngOnInit(): void {
  }

  async addNewUser(){
    //console.log(this.newUser)
    await this.httpClient.post<any>(this.url + 'users/newUser', this.newUser).subscribe(response => {
      this.router.navigate(['/']);
      //ya estufas
    })
  }

}
