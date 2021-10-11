import { Component, Input } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  login:any= environment.isLoggedIn;

  title = 'GEPROYS';

  ngOnInit(): void {
    //console.log(this.login)
  }
}
