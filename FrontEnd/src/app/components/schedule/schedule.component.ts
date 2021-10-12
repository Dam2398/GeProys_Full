import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  url =  environment.API_URL
  projects: any;
  sprints: any;
  sprintInicio: any [] = [];
  sprintFin: any [] = [];
  CalenderBegin: any [] = [];
  CalenderEnd: any [] = [];
  CalenderTotal: any [] = [];

  constructor(
    private httpClient : HttpClient,
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  private getProjects() {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseProjects = this.httpClient.get(this.url + 'projects/misProyectos?userId=' + this.idUser, { headers }).toPromise();
    promiseProjects.then((data) => {
      this.projects = data;
      this.getSprints(this.projects)
    }).catch((error) => {
      Swal.fire({
        title: 'Oops..',
        text: 'Parece que algo salio mal',
        icon: 'error', //error or success
        confirmButtonText: 'Ok'
      })
    })
  }

  async getSprints(project: any) {
    for(let i = 0; i < project.length ; i++) {
     let headers = new HttpHeaders().set('auth', `${this.localToken}`)
     let promiseSprints = this.httpClient.get(this.url + 'sprints/sprintsProject/?projectId=' + project[i].id + '&userId=' + this.idUser, { headers }).toPromise();
     await promiseSprints.then((data) => {
       this.sprints = data;
       this.orderCalender(project[i],this.sprints)
     }).catch((error) => {
       console.log(error);
     })
    }
    this.CalenderTotal = this.CalenderBegin.concat(this.CalenderEnd)
    this.CalenderTotal.sort(function(a,b){ 
      var x = a.date < b.date? -1:1; 
      return x; 
    });
    //console.log(this.CalenderTotal)
  }
  
  orderCalender(project: any, sprints: any) {
    for(let i = 0; i < sprints.length; i++){
      this.sprintInicio.push({
        'begin_end' : 'Inicio de Sprint',
        'nameProject' : project.name,
        'sprintName' : sprints[i].name,
        'daily' : sprints[i].daily,
        'date' : sprints[i].fechaInicio
      });
      this.sprintFin.push({
        'begin_end' : 'Fin de Sprint',
        'nameProject' : project.name,
        'sprintName' : sprints[i].name,
        'daily' : sprints[i].daily,
        'date' : sprints[i].fechaFin
      });
      this.CalenderBegin = this.sprintInicio;
      this.CalenderEnd = this.sprintFin;
    }
  }

}
