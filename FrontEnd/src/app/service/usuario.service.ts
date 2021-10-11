import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError, BehaviorSubject } from 'rxjs';
//import {User} from "../models/user";
import {User, UserResponse} from "../models/user.interface";
import {catchError, map}from 'rxjs/operators'
import { JwtHelperService } from "@auth0/angular-jwt";

import { environment } from './../../environments/environment';

const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  //private url = 'http://localhost:3000/';
  urlLogin = environment.API_URL + 'auth/login'

  constructor(private http: HttpClient) { 
    this.checkToken();
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  login(authData: User): Observable<UserResponse | void>{
    return this.http.post<UserResponse>(this.urlLogin, authData)
      .pipe(
        map( (res:UserResponse)=>{
         /*  console.log('Res->', res) //IMPRIME LO QUE MANDO EL SERVIDOR
          console.log(res.userId); */
          
          //SAVETOKEN
          this.SaveToken(res.token,res.userId)
          this.SaveUser(res);
          this.loggedIn.next(true);
          environment.isLoggedIn = true;
          return res;//REPUESTA
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  public logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('idUser');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    environment.isLoggedIn = false;
  }

  public checkToken():any{
    const userToken:any = localStorage.getItem('token');
    const isExpired =helper.isTokenExpired(userToken);//helper
    //console.log('IsExpired->', isExpired);
    if(isExpired){
      this.logout();
      return true
    }else{
      this.loggedIn.next(true);
      return false;
    }
  }
  
  private SaveToken(token:string,idUser: any): void{
    localStorage.setItem("token",token);//Se guarda y se ve en applications
    localStorage.setItem('idUser', idUser);
  }

  private SaveUser(user:Object):void{
    localStorage.setItem("user",JSON.stringify(user));
  }

  private handlerError(err: any): Observable<never> {
    let errorMessage = 'An errror occured retrienving data';
    if (err) {
      errorMessage = `Error: code ${err.message}`;
    }
    window.alert('Correo o contraseña incorrectos');
    return throwError(errorMessage);
  }
}
