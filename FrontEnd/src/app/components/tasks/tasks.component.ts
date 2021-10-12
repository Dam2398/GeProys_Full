import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2'

import { ChatService } from "./../../service/chat.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  localUser:any = localStorage.getItem('user');
  urlSprints =  environment.API_URL 
  idProject: any;
  sprints: any;
  infoProject: any;
  selectedItem: any;
  daily: any;
  beginDate: any;
  endDate: any;
  buttonShown: any;
  buttonBacklog: any;
  idUserLocal: any;
  roleUser:any;
  aux: any;

  public newSprint = {
    name: '',
    daily: '',
    fechaInicio: '',
    fechaFin: ''
  }

  public newTask = {
    name: '',
    description: '',
    status: '',
    priority: ''
  }

  constructor(
    private chatSvc:ChatService,
    private httpClient : HttpClient,
    private router : Router,
    private route : ActivatedRoute
  ) { }

  async ngOnInit() {
    this.buttonShown = false
    this.buttonBacklog = false
    this.route.params.subscribe(params => {
      this.idProject = params['id'];//id del proyecto
    });

    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let PromiseUserbyId = this.httpClient.get(this.urlSprints + 'urp/equipo/?projectId=' + this.idProject + '&userId=' + this.idUserLocal, { headers }).toPromise();
    await PromiseUserbyId.then((data) => {
      this.aux = data
      for(let i = 0; i < this.aux.length; i++) {
        if(this.aux[i]['id'] == this.idUserLocal){
          this.roleUser = this.aux[i]['rol']
        }
      }
    }).catch((error) => {
      Swal.fire({
        title: 'Oops..',
        text: 'Parece que algo salio mal',
        icon: 'error', //error or success
        confirmButtonText: 'Ok'
      })
    })

    this.getProject(this.idProject);
    this.getSprints(this.idProject);
  }

  private getSprints(id: number) {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseSprints = this.httpClient.get(this.urlSprints + 'sprints/sprintsProject/?projectId=' + id + '&userId=' + this.idUser, { headers }).toPromise();
    promiseSprints.then((data) => {
      this.sprints = data;
    }).catch((error) => {
      Swal.fire({
        title: 'Oops..',
        text: 'Parece que algo salio mal',
        icon: 'error', //error or success
        confirmButtonText: 'Ok'
      })
    })
  }

  private getProject(id:number) {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseInfoProject = this.httpClient.get(this.urlSprints + 'projects/?userId=' + this.idUser + '&projectId=' + id, { headers }).toPromise();
    promiseInfoProject.then((data) => {
      this.infoProject = data;
    }).catch((error) => {
      Swal.fire({
        title: 'Oops..',
        text: 'Parece que algo salio mal',
        icon: 'error', //error or success
        confirmButtonText: 'Ok'
      })
    })
  } 

  printSprint(that: any){
    this.buttonBacklog = true
    this.router.navigate(['Backlog/Proyecto/' + this.idProject]);
    this.daily = that.daily;
    this.beginDate = that.fechaInicio;
    this.endDate = that.fechaFin; 
    this.selectedItem = that.id;
  }

  seeSprint(that: any) {//ver tarea
    this.router.navigate(['Sprint',that], { relativeTo: this.route });
    this.buttonShown = true
  }

  goChart(id: any){//para la grafica
    //this.router.navigate(['grafica',id] )
    this.router.navigate(['grafica'], {queryParams:{
      projectId: this.idProject,
      sprintId: id
    }})
  }

  addNewSprint() {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    this.httpClient.post<any>(this.urlSprints + 'sprints/newSprint/?projectId=' + this.idProject + '&userId=' + this.idUser, this.newSprint, {headers}).subscribe(response => {
      if(response.msg == 'OK') {
        this.getSprints(this.idProject);
        this.newSprint.name = '';
        this.newSprint.daily = '';
        this.newSprint.fechaInicio = '';
        this.newSprint.fechaFin = '';
        const msg = `ha creado un sprint`;//not crearsprint
        this.chatSvc.emit3('send-notification', 'n'+this.idProject,msg,this.idUser);
        Swal.fire({
          title: 'Excelente',
          text: 'Sprint agregado correctamente',
          icon: 'success', //error or success
          confirmButtonText: 'Ok'
        })
      } else {
        Swal.fire({
          title: 'Oops..',
          text: 'Parece que algo salio mal',
          icon: 'error', //error or success
          confirmButtonText: 'Ok'
        })
      }
    })
  }

  async addNewTask(){
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    this.httpClient.post<any>(this.urlSprints + 'tareas/nuevaTarea/?sprintId=' + this.selectedItem + '&projectId=' + this.idProject + '&userId=' + this.idUser, this.newTask , {headers}).subscribe(response => {
      if(response.msg == 'OK') {
        const msg = `ha creado una tarea`;
        this.chatSvc.emit3('send-notification', 'n'+this.idProject,msg,this.idUser)
        this.router.navigateByUrl('Backlog/Proyecto/' + this.idProject);
        Swal.fire({
          title: 'Excelente',
          text: 'Tarea agregada correctamente',
          icon: 'success', //error or success
          confirmButtonText: 'Ok'
        })
      } else {
        //handdle errors
        Swal.fire({
          title: 'Oops..',
          text: 'Parece que algo salio mal',
          icon: 'error', //error or success
          confirmButtonText: 'Ok'
        })
      }
    })
  }

  onChat():void{
    this.router.navigate(['chat'], {queryParams:{
      projectId: this.idProject
    }})
  }
  onKanbas():void{
    this.router.navigate(['kanban'],{queryParams:{
      projectId: this.idProject
    }})
  }
}
