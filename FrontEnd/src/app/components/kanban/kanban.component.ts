import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { isPromise } from '@angular/compiler/src/util';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {


  projectId: any;

  sprintAct:any;
  backlog:any;
  backlogNull:any;

  user: any;
  teamUser: any[] = [];
  teams: any [] = [];
  

  output: any[] = [];
  outputDos: any[] = [];
  outputTres :any[] = [];
  nombre:any;

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlSprints =  environment.API_URL 


  constructor(private httpClient : HttpClient,
              private router : Router,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'];//id del proyecto
      //console.log(this.projectId)

    });

    this.sprintActual();
    //this.getMiembro(28)
    //console.log(this.nombre)
    //this.getMiembro(28);
 
  }

  sprintActual(){
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    let proSprint = this.httpClient.get(this.urlSprints+'sprints/SprintActual/?projectId='+this.projectId+'&userId='+this.idUser,{headers}).toPromise();
    proSprint.then((data)=>{
      this.sprintAct = data;
      //console.log(this.sprintAct['id'])//listo
      this.getTareasAsig(this.sprintAct['id'])
      this.getTareasNula(this.sprintAct['id'])
    }).catch((error) => {
      console.log(error);
    })
  }

  getTareasAsig(id:any){
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    let promise = this.httpClient.get(this.urlSprints+ `tareas/tareasAsignadas?sprintId=${id}&userId=${this.idUser}&projectId=${this.projectId}`,{headers}).toPromise();
    promise.then((data)=>{
      this.backlog = data;
      //console.log(this.backlog)
      this.displayAsig(this.backlog)
    })
  }

  getTareasNula(id:any){
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    let proTarNulas = this.httpClient.get(this.urlSprints+`tareas/tareasNoAsignadas?sprintId=${id}&projectId=${this.projectId}&userId=${this.idUser}`,{headers}).toPromise();
    proTarNulas.then((data)=>{
      this.backlogNull = data;
      //console.log(this.backlogNull)
      //console.log('getTareasNula');
      setTimeout(() => {
        this.displayNULL(this.backlogNull)
      }, 1000);
      
    })
  }




  displayNULL(data:any){
    if(!!!data) return;
    for (let i = 0; i < data.length; i++) {
      this.output.push({
        titulo: data[i].name,
        texto: data[i].description,
        status: 'backlog',//si son nulas no se han trabajado
        prioridad: data[i].priority
      })
    }
  }

  async displayAsig(data:any){
    if(!!!data) return;
    for (let i = 0; i < data.length; i++) {


      let headers = new HttpHeaders().set('auth', `${this.localToken}`);//Obtenemos el urp para sacar la id del usuario
      let proMiembro = this.httpClient.get(this.urlSprints+`urp/equipo/miembro/${data[i].urpId}?projectId=${this.projectId}&userId=${this.idUser}`,{headers}).toPromise();
      proMiembro.then((urp)=>{
        let miembro:any =urp
        //console.log(miembro['userId'])//con la id del usuario buscamos su nombre
        let proUser = this.httpClient.get(this.urlSprints+`users/${miembro['userId']}?userId=${this.idUser}`,{headers}).toPromise();
        proUser.then((user)=>{
          let usuario:any = user;
          this.nombre =  `${usuario['firstName']} ${usuario['lastName']}`
          let nombre:string =`${usuario['firstName']} ${usuario['lastName']}`
          //console.log(nombre)//si jala
          //guardamos en el arregl
          //console.log(data[i].name)
          this.outputDos.push({
            titulo: data[i].name,
            texto: data[i].description,
            status: data[i].status,
            prioridad: data[i].priority,
            miembro: String(nombre)
          })
          
          //console.log(typeof this.nombre)
        }).catch((error)=>{
          console.log(error)
          })
        
      }).catch((error)=>{
        console.log(error)
        })
    }

    setTimeout(() => {//si es esto
      this.outputTres = this.outputDos
    }, 1000);
  }



}
