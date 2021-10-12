import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-aboutto',
  templateUrl: './aboutto.component.html',
  styleUrls: ['./aboutto.component.css']
})
export class AbouttoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //console.log(environment.isLoggedIn)
  }

}
