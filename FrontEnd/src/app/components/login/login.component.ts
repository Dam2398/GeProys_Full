import { Component ,OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router'
import { UsuarioService } from './../../service/usuario.service';
import { HeaderComponent } from "./../header/header.component";
import { ChatService } from "./../../service/chat.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{

  @ViewChild(HeaderComponent) hijo!:HeaderComponent ;


  urlLogin = environment.API_URL + 'auth/login'

  public login = {
    email: '',
    password: ''
  }

  loggg!:boolean;

  constructor(
    private chatS:ChatService,
    private userSvc:UsuarioService,
    private router : Router  
  ) { }

  ngOnInit(): void {
    this.userSvc.checkToken()       //  AQUI CAMBIE PARA CHECAR EL TOKEN  ||  ULTIMO MODIFICACION
  }

  loginUser(){
    this.userSvc.login(this.login).subscribe((res)=>{
      
      if(res){                            //    AQUI CAMBIE PARA CHECAR EL TOKEN  ||  ULTIMO MODIFICACION
        //this.loggg=true;
        //console.log('Este es el loggg',this.loggg)
        //this.hijo.desdeLogin();
        //this.hijo.valores(res.userId, res.username)
        this.router.navigate(['Proyectos']);
        this.chatS.conectar();
        //this.userSvc.checkToken()
      }                                     //     AQUI CAMBIE PARA CHECAR EL TOKEN  ||  ULTIMO MODIFICACION
    })
  }


}
