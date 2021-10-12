import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-invitaciones',
  templateUrl: './invitaciones.component.html',
  styleUrls: ['./invitaciones.component.css']
})
export class InvitacionesComponent implements OnInit {

  datosForm: any ={};
  salida : any ={};
  msg:string='¡Bienvenido a tu nuevo equipo de trabajo!';
  ok:boolean;
  projectId:string ;
  rol:string ;
  email:string ;

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlINV =  environment.API_URL + 'projects/des'
  urlACP = environment.API_URL+ 'urp/newUrp/'
  //htttp://localhost:3000/newUrp/?projectId=1&rol=ScrumMaster&mail=blablablabla

  constructor(private httpClient : HttpClient,
              private route: ActivatedRoute,
              private router: Router) { 

                this.email='';
                this.rol='';
                this.projectId ='';
                this.ok = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{
      this.projectId = params['projectId'];
      this.rol = params['rol'];
      this.email = params ['email'];
      //console.log(this.projectId, this.rol ,this.email)
    })
    this.datosForm ={//datos encriptados
      projectId: this.projectId,
      rol: this.rol,
      email: this.email
    }

    //console.log(this.datosForm)//datos encriptados
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    this.httpClient.post<any>(this.urlINV + `?userId=${this.idUser}`,this.datosForm , {headers}).subscribe(responde =>{
      this.salida = responde;
    });

  }

  aceptar(){
    //console.log(this.salida['emailDes'])
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    this.httpClient.post<any>(this.urlACP+`?projectId=${this.salida['proDes']}&rol=${this.salida['rolDes']}&email=${this.salida['emailDes']}`,null,{headers}).subscribe(response =>{
      
      if(response){

        this.ok = true;
        //console.log(this.msg+'ok')
        setTimeout(() => {
          this.router.navigate(['Backlog/Proyecto/',this.salida['proDes']]);
        }, 3000);
         
      }
      
    })
    
  }

}
